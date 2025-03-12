import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { comntdata, Posts } from '../displayposts/displayposts.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
})
export class EditPostComponent {
  testvariable!: string;
  posts: Posts[] = [];
  userPosts!: Posts[];
  postId: any;
  Editpost: any;
  comments: comntdata[] = [];
  selectedpostid: any;
  storedPostId!: string | null;

  constructor(private authservice: AuthService, private router: Router) {}

  ngOnInit() {
    this.fetchuserposts();
    this.fetid();
   // this.fetchcmnts();
  }

  fetid() {
    const storedPostId = localStorage.getItem('selectedPostId');
    if (storedPostId) {
      this.postId = storedPostId; // Assigning postId to class property
      console.log(this.postId, 'Selected Post ID');
    }
  }

  fetchuserposts() {
    this.authservice.getuserposts().subscribe((posts) => {
      this.userPosts = posts;
      console.log(this.userPosts);
    });
  }

  mdfyuserpost() {
    const updatedPost = this.userPosts.find((post) => post.id === this.postId);

    if (updatedPost) {
      const payload = {
        title: updatedPost.title,
        content: updatedPost.content,
        imageurl: updatedPost.imageurl,
      };

      console.log('Updating post with ID:', this.postId);
      console.log('Payload to be sent:', payload);

      this.authservice.modifyPostsInfo(this.postId, payload).subscribe(
        (response) => {
          console.log('Post updated successfully', response);
          alert('Post updated successfully!');
          this.router.navigate(['/myaccount']);
        },
        (error) => {
          console.error('Error updating post', error);
          alert('Failed to update post. Please try again.');
        }
      );
    } else {
      alert('Post not found!');
    }
  }

  navgtomyacc() {
    this.router.navigate(['/myaccount']);
  }



  deletePost() {
    const storedPostId: string | null = localStorage.getItem('selectedPostId');

    if (!storedPostId) {
      console.error('No post ID found in localStorage.');
      return;
    }

    // First, fetch all comments to find those related to the post
    this.authservice.getcomnts().subscribe({
      next: (data: Record<string, any>) => {
        const comments = Object.entries(data).map(([key, cmntdata]) => ({
          id: key,
          ...cmntdata,
        }));

        // Filter comments belonging to this post
        const relatedComments = comments.filter(
          (comment) => comment.postId === storedPostId
        );

        if (relatedComments.length === 0) {
          // No comments exist, delete the post immediately
          this.deletePostFromBackend(storedPostId);
          return;
        }

        // Delete each comment one by one
        const deleteRequests = relatedComments.map((comment) =>
          this.authservice.deleteCommentById(comment.id).toPromise()
        );

        Promise.all(deleteRequests)
          .then(() => {
            console.log('All associated comments deleted successfully.');
            // Now delete the post after comments are deleted
            this.deletePostFromBackend(storedPostId);
          })
          .catch((error) => {
            console.error('Error deleting comments:', error);
            alert('Failed to delete comments. Please try again.');
          });
      },
      error: (error) => {
        console.error('Error fetching comments:', error);
      },
    });
  }

  // Helper function to delete post after comments are removed
  deletePostFromBackend(postId: string) {
    this.authservice.deletePostById(postId).subscribe(
      () => {
        console.log('Post deleted successfully.');
        this.userPosts = this.userPosts.filter((post) => post.id !== postId);
        alert('Post and associated comments deleted successfully!');
        this.router.navigate(['/myaccount']);
      }
    );
  }
}
