import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { comntdata } from '../displayposts/displayposts.model';


@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.component.html',
  styleUrls: ['./myaccount.component.scss'],
})
export class MyaccountComponent implements OnInit {
  currentIndex: number = 0;
  selectedPost: any;
  comments: comntdata[] = [];
  isModalOpen!: boolean;
  selectedpostid: string = '';
  cmnttxt: string = '';
  likeusers!: boolean;
  issharepost!: boolean;
  selectedUsers: string[] = []; // Array to store selected user IDs

  userdetails: any[] = [];

  selectedFile!: File;
  imageUrl: string = '';
  isUploading: boolean = false;

  constructor(private authservice: AuthService, private router: Router) {}
  userPosts: any[] = [];
  userdata: any[] = [];
  likedataa: { [key: string]: any } = {}; // Define as an object

  ngOnInit(): void {
    this.fetchuserposts();
    this.fetchuserdetails();
    this.likesfunc;
    this.fetchcmnts();
    this.fetchUsers();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // upload(): void {
  //   if (!this.selectedFile) return;

  //   this.isUploading = true;
  //   this.authservice
  //     .uploadImage(this.selectedFile)
  //     .then((url) => {
  //       this.imageUrl = url;
  //       this.isUploading = false;
  //       console.log('Image uploaded. URL:', url);
  //     })
  //     .catch((error) => {
  //       console.error('Upload failed:', error);
  //       this.isUploading = false;
  //     });
  // }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }
  fetchuserposts() {
    this.authservice.getuserposts().subscribe((posts) => {
      this.userPosts = posts.map((post) => ({
        ...post,
        currentIndex: 0, //  Initialize currentIndex for each post
      }));
      console.log(this.userPosts);
    });
  }

  fetchuserdetails() {
    this.authservice.getuserdata().subscribe((userdetails) => {
      this.userdata = userdetails;
      console.log(this.userdata, ':::::::::');
    });
  }

  prevSlide(post: any): void {
    if (post.imageurl && post.imageurl.length > 1) {
      post.currentIndex =
        post.currentIndex > 0
          ? post.currentIndex - 1
          : post.imageurl.length - 1;
    }
  }

  nextSlide(post: any): void {
    if (post.imageurl && post.imageurl.length > 1) {
      post.currentIndex =
        post.currentIndex < post.imageurl.length - 1
          ? post.currentIndex + 1
          : 0;
    }
  }

  goToSlide(post: any, index: number): void {
    if (post.imageurl && post.imageurl.length > 1) {
      post.currentIndex = index;
    }
  }

  fetchPostById(postId: string) {
    // Store clicked post ID in localStorage
    localStorage.setItem('selectedPostId', postId);
    console.log(postId);
    this.router.navigate(['/editpost']);
    // Find the post by ID
    const selectedPost = this.userPosts.find((post) => post.id === postId);
    if (selectedPost) {
      console.log('Selected Post:', selectedPost);
      this.selectedPost = selectedPost; // Store for UI binding if needed
    } else {
      console.log('Post not found!');
    }
  }

  likesfunc() {
    this.authservice.getposts().subscribe((response) => {
      this.likedataa = Object.fromEntries(
        Object.entries(response).map(([key, value]: [string, any]) => [
          key, // Keep the unique identifier
          {
            ...value, // Spread the original object
            //clickCount: value.clickCount || 0, // Ensure clickCount exists inside the object
          },
        ])
      );
      console.log(this.likedataa, 'Updated Data');
    });
  }

  fetchcmnts() {
    this.authservice.getcomnts().subscribe({
      next: (data: Record<string, any>) => {
        this.comments = Object.entries(data).map(([key, cmntdata]) => ({
          id: key,
          ...cmntdata,
        }));
      },
    });
  }
  get filteredComments(): comntdata[] {
    return this.comments.filter(
      (comment) => comment.postId === this.selectedpostid
    );
  }
  getCommentCount(postId: string): number {
    return this.comments.filter((comment) => comment.postId === postId).length;
  }

  get hasComments(): boolean {
    return this.filteredComments.length > 0;
  }

  closeModal() {
    this.isModalOpen = false;
    this.likeusers = false;
    document.body.style.overflow = '';
  }

  comntsec(postId: string) {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';
    console.log('Clicked Post ID:', postId); // Logs only the clicked post ID
    this.selectedpostid = postId;
    this.fetchcmnts();
  }

  deleteComment(commentId: string) {
    this.comments = this.comments.filter((comment) => comment.id !== commentId); // Remove comment locally

    // Call API to delete comment from backend (ensure correct API call)
    this.authservice.deleteCommentFromDB(commentId).subscribe(() => {
      console.log('Comment deleted:', commentId);
    });
  }

  postcomment() {
    this.authservice
      .commentApi(this.cmnttxt, this.selectedpostid)
      .subscribe((data) => {
        console.log(data);
        this.cmnttxt = '';
        this.fetchcmnts();
      });
  }
  openlikeusers(post: any) {
    this.likeusers = true;
    this.selectedPost = post;
    document.body.style.overflow = 'hidden';
  }

  toggleUserSelection(user: any) {
    const index = this.selectedUsers.indexOf(user.userid);

    if (index === -1) {
      this.selectedUsers.push(user.userid); // Add user if not already selected
    } else {
      this.selectedUsers.splice(index, 1); // Remove user if deselected
    }
  }

  getUserById(userId: number): any {
    return this.userdetails.find((user) => user.userid === userId);
  }

  sharePostToBackend() {
    if (!this.selectedpostid) {
      console.error('No post ID available!');
      return;
    }

    if (this.selectedUsers.length === 0) {
      console.error('No users selected!');
      return;
    }

    this.selectedUsers.forEach((userid) => {
      this.authservice.savePostShare(this.selectedpostid, userid).subscribe({
        next: (res) => {
          console.log(`Shared successfully with ${userid}:`, res);
          this.selectedUsers = [];
          this.issharepost = false;
        },
        error: (err) => {
          console.error(`Error sharing post with ${userid}:`, err);
        },
      });
    });

    // Clear the selection after sharing
  }
  sharePost(postId: string) {
    this.issharepost = true;
    this.selectedpostid = postId; // Store the post ID

    document.body.style.overflow = 'hidden';
  }
  clsshrpstmdl() {
    this.issharepost = false;
    document.body.style.overflow = '';
  }
  fetchUsers() {
    this.authservice.getusers().subscribe({
      next: (data) => {
        // Assuming API returns an object and you need to convert it to an array
        this.userdetails = Object.values(data); // Converts object values into an array
        console.log(this.userdetails);
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.userdetails = []; // Fallback to an empty array
      },
    });
  }
}