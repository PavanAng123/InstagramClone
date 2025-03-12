import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { userdetails } from '../myaccount/myaccount.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private authservice: AuthService) {}

  userdetails: any[] = []; // Array to store user data
  filteredUsers: any[] = []; // Array for filtered results
  searchQuery: string = ''; // Two-way bound input for search
  selectedUser: userdetails | null = null;
  userPosts: any[] = [];
  norecor = 'No Records found';
  currentIndex: number = 0;
  showonlyuserposts= false;

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

  // fetchUsers() {
  //   this.authservice.getusers().subscribe({
  //     next: (data) => {
  //       const allUsers = Object.values(data);
  //       this.filteredUsers = allUsers.filter((user) =>
  //         user.Username.toLowerCase().includes(this.searchQuery.toLowerCase())
  //       );
  //     },
  //     error: (err) => console.error('Error fetching user details:', err),
  //   });
  // }

  onSearch() {
    this.showonlyuserposts = false;
    const query = this.searchQuery.toLowerCase();
    this.filteredUsers = this.userdetails.filter(
      (userdetails) =>
        userdetails.firstname.toLowerCase().includes(query) ||
        userdetails.lastname.toLowerCase().includes(query) ||
        userdetails.Username.toLowerCase().includes(query)
    );
  }

  ngOnInit() {
    this.fetchUsers();
  }

  // getSearchUserDetails(user: userdetails) {}

  selectUser(user: userdetails) {
    this.showonlyuserposts = true;
    this.selectedUser = user;
    console.log(user);

    // Fetch posts related to the selected user
    this.authservice.getSearchUserPosts(user.userid).subscribe({
      next: (posts) => {
        if (!posts || posts.length === 0) {
          console.log('No posts found for user:', user.userid);
          this.userPosts = [];
          return;
        }

        // Initialize `currentIndex` for each post
        this.userPosts = posts.map((post: any) => ({
          ...post,
          currentIndex: 0, // Add `currentIndex` to each post
        }));

        console.log(this.userPosts);
        console.log(user.userid);
      },
      error: (err) => console.error('Error fetching user posts:', err),
    });
  }

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
}
