import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { comntdata, Posts } from './displayposts.model';

@Component({
  selector: 'app-displayposts',
  templateUrl: './displayposts.component.html',
  styleUrls: ['./displayposts.component.scss'],
})
export class DisplaypostsComponent implements OnInit {
  profilePicture!: string;
  testvariable: any;
  localId: any;
  posts: Posts[] = [];
  data: any;
  likedataa: { [key: string]: any } = {}; // Define as an object
  images: string[] = [];
  currentIndex: number = 0;
  clickCount: any;
  increment!: boolean;
  redheart!: boolean;
  isModalOpen = false;
  cmnttxt: string = '';
  selectedpostid: string = '';
  comments: comntdata[] = [];
  likeuserspropics!: string;
  issharepost = false;
  userdetails: any[] = [];
  selectedUsers: string[] = []; // Array to store selected user IDs
  constructor(private authservice: AuthService) {}

  ngOnInit() {
    this.fetchposts();
    this.likesfunc();
    this.fetchcmnts();
    this.fetchUsers();
  }

  fetchUsers() {
    this.authservice.getusers().subscribe({
      next: (data) => {
        // Assuming API returns an object and you need to convert it to an array
        this.userdetails = Object.values(data); // Converts object values into an array
        console.log(this.userdetails)
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.userdetails = []; // Fallback to an empty array
      },
    });
  }

  fetchposts() {
    this.authservice.getposts().subscribe({
      next: (data): void => {
        console.log(data);
        this.posts = Object.entries(data).map(([key, postdata]) => ({
          ...postdata,
          id: key,
          currentIndex: 0, // Initialize each post's current index
        }));

        // Access each post's ID
        this.posts.forEach((post) => {
          //console.log('Post ID:', post.id); // Log each post's ID
          if (Array(post.id)) {
            this.testvariable = post.id;
            console.log(this.testvariable, 'idsss');
          }
        });
      },
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

  likesfunc() {
    this.authservice.getposts().subscribe((response) => {
      this.likedataa = Object.fromEntries(
        Object.entries(response).map(([key, value]: [string, any]) => [
          key, // Keep the unique identifier
          {
            ...value, // Spread the original object
            clickCount: value.clickCount || 0, // Ensure clickCount exists inside the object
          },
        ])
      );
      console.log(this.likedataa, 'Updated Data');
    });
  }

  updateCount(postId: string, increment: boolean) {
    if (this.likedataa[postId]) {
      const localId = localStorage.getItem('localId');
      const profilePicture = localStorage.getItem('profilePicture');
      const Username = localStorage.getItem('Username');

      // Initialize likeusersdata as an array if not present
      let currentUsersData = this.likedataa[postId].likeusersdata;
      if (!Array.isArray(currentUsersData)) {
        currentUsersData = [];
      }

      // Initialize likeruserpropics as an array if not present
      let currentUserPics = this.likedataa[postId].likeruserpropics;
      if (!Array.isArray(currentUserPics)) {
        currentUserPics = [];
      }

      let currentUsername = this.likedataa[postId].likeusername;
      if (!Array.isArray(currentUsername)) {
        currentUsername = [];
      }
      if (localId) {
        // Update likeusersdata array
        if (increment && !currentUsersData.includes(localId)) {
          currentUsersData.push(localId);
        } else if (!increment && currentUsersData.includes(localId)) {
          currentUsersData = currentUsersData.filter(
            (id: string) => id !== localId
          );
        }

        // Update likeruserpropics array
        if (
          increment &&
          Username &&
          profilePicture &&
          !currentUserPics.includes(profilePicture)
        ) {
          currentUserPics.push(profilePicture);
          currentUsername.push(Username);
        } else if (!increment && profilePicture && Username) {
          currentUserPics = currentUserPics.filter(
            (pic: string) => pic !== profilePicture
          );
          currentUsername = currentUsername.filter(
            (name: string) => name !== Username
          );
        }
      }

      // Update the likedataa object with the new data
      this.likedataa[postId] = {
        ...this.likedataa[postId],
        clickCount: increment
          ? this.likedataa[postId].clickCount + 1
          : Math.max(this.likedataa[postId].clickCount - 1, 0),
        likeusersdata: currentUsersData,
        likeruserpropics: currentUserPics,
        likeusername: currentUsername,
      };

      console.log('Updated Post:', this.likedataa[postId]);
    }

    // Save updated like count in the backend
    this.authservice.likesApi(this.likedataa).subscribe((updatedresponse) => {
      console.log('Data saved in backend', updatedresponse);
      this.fetchposts();
    });
  }

  isLiked(postId: string): boolean {
    this.localId = localStorage.getItem('localId');
    return this.likedataa[postId]?.likeusersdata?.includes(this.localId);
  }
  //images display starts here

  // Navigate to the previous slide (specific to each post)
  prevSlide(post: any): void {
    post.currentIndex =
      post.currentIndex > 0 ? post.currentIndex - 1 : post.imageurl.length - 1;
  }

  // Navigate to the next slide (specific to each post)
  nextSlide(post: any): void {
    post.currentIndex =
      post.currentIndex < post.imageurl.length - 1 ? post.currentIndex + 1 : 0;
  }

  // Jump to a specific slide using dots (specific to each post)
  goToSlide(post: any, index: number): void {
    post.currentIndex = index;
  }

  comntsec(postId: string) {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden';

    console.log('Clicked Post ID:', postId); // Logs only the clicked post ID
    this.selectedpostid = postId;
    this.fetchcmnts();
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';
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

  deleteComment(commentId: string) {
    this.comments = this.comments.filter((comment) => comment.id !== commentId); // Remove comment locally

    // Call API to delete comment from backend (ensure correct API call)
    this.authservice.deleteCommentFromDB(commentId).subscribe(() => {
      console.log('Comment deleted:', commentId);
    });
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


  toggleUserSelection(user: any) {
    const index = this.selectedUsers.indexOf(user.userid);

    if (index === -1) {
      this.selectedUsers.push(user.userid); // Add user if not already selected
    } else {
      this.selectedUsers.splice(index, 1); // Remove user if deselected
    }
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
          this.issharepost=false;
        },
        error: (err) => {
          console.error(`Error sharing post with ${userid}:`, err);
        },
      });
    });

    // Clear the selection after sharing
    
  }
}
