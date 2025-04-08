import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Posts } from '../displayposts/displayposts.model';
import { userdetails } from '../myaccount/myaccount.model';
import { PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
})
export class ChatsComponent implements OnInit, PipeTransform {
  chatPairs: string[] = [];
  chatHistory: any[] = [];
  selectedPair!: string;
  posts: Posts[] = [];
  filteredPosts: any[] = [];
  userdetails: userdetails[] = [];
  matchedUsers: userdetails[] = [];
  localId!: string | null; // Logged-in user ID
  isModalOpen!: boolean;
  chattxt!: string;
  otherUserId!: string;
  receiverId: string = ''; // Variable to store receiverId
  reciverpic!: any;
  selectedUser: userdetails | null = null;
  chatHistories: { [pair: string]: any[] } = {}; // Store chat history for each pair
  lastMessages: { [key: string]: string } = {}; // Initialize to prevent undefined errors
  lastMsgsender: { [key: string]: string } = {};
  lastMsgreciver: { [key: string]: string } = {};

  searchQuery: string = '';
  filteredUsers: userdetails[] = []; // List of filtered users
  currentIndex: number = 0;
  messages: any[] = [];
  pollingInterval: any;

  constructor(
    private authservice: AuthService,
    private cdr: ChangeDetectorRef
  ) {}
  transform(value: any, ...args: any[]) {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.localId = localStorage.getItem('localId');
    this.fetchUsers();
    this.loadChatPairs();
    this.fetchPosts();

    // Poll every 3 seconds
    this.pollingInterval = setInterval(() => {
      if (this.selectedPair) {
        this.loadChatHistory(this.selectedPair, true); // pass true to avoid UI change like scroll, modal etc.
      }
    }, 3000);
  }

  loadChatPairs() {
    this.authservice.getChatPairs().subscribe({
      next: (pairs) => {
        if (pairs && pairs.length > 0) {
          this.chatPairs = pairs.filter((pair) => this.isUserInChatPair(pair)); // Store the chat pairs
          this.loadLastMessages(); // Now load last messages
        } else {
          console.warn('No chat pairs available.');
        }
      },
      error: (err) => console.error('Error fetching chat pairs:', err),
    });
  }

  // Loads chat history for a selected user pair

  loadChatHistory(pair: string, isPreloading: boolean = false) {
    const [user1, user2] = pair.split('+');

    if (!isPreloading) {
      this.selectedPair = pair;
    }

    const user = this.getUserDetailsFromPair(pair);

    if (user) {
      this.selectedUser = user;
    }

    this.authservice.getChatHistory(user1, user2).subscribe({
      next: (history) => {
        this.chatHistories[pair] = history; // Store chat history for this pair
        this.chatHistory = history;

        // Store the receiverId from the latest chat message
        if (history.length > 0) {
          this.receiverId = history[0].receiverId; // Assuming the first item has the latest receiverId
        }

        // Merge matched users from chat sender IDs
        const newUsers = history
          .map((chat) => this.getUserBySenderId(chat.senderId))
          .filter((user): userdetails | undefined => user) as userdetails[];

        this.addUniqueUsers(newUsers);

        // Filter posts based on chatHistory postId
        this.filterMatchingPosts();

        this.isModalOpen = true;
        document.body.style.overflow = 'hidden';

        // Ensure UI updates after data change
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching chat history:', err),
    });
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = '';

    // Stop the polling interval
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }
  //  Fetches posts from the server
  fetchPosts() {
    this.authservice.getposts().subscribe({
      next: (data) => {
        this.posts = Object.entries(data || {}).map(([key, postdata]) => ({
          ...postdata,
          id: key,
          currentIndex: 0, // Initialize each post's current index
        }));

        if (this.chatHistory.length) {
          this.filterMatchingPosts();
        }
      },
      error: (err) => console.error('Error fetching posts:', err),
    });
  }

  // Fetch all users from the API
  fetchUsers() {
    this.authservice.getusers().subscribe({
      next: (data) => {
        this.userdetails = Object.values(data);
        this.filteredUsers = [...this.userdetails]; // Initialize filtered list
      },
      error: (err) => console.error('Error fetching user details:', err),
    });
  }

  // Filter users based on search input
  filterUsers() {
    this.filteredUsers = this.userdetails.filter(
      (user) =>
        user.Username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.firstname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.lastname.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  filterMatchingPosts() {
    if (!this.chatHistory.length) {
      this.filteredPosts = [];
      return;
    }

    // Merge posts and chats
    this.filteredPosts = this.chatHistory
      .map((chat) => {
        if (chat.postId) {
          // If the chat entry has a postId, find the matching post
          const matchingPost = this.posts.find(
            (post) => post.id === chat.postId
          );
          return matchingPost
            ? {
                ...matchingPost,
                senderId: chat.senderId,
                timestamp: chat.timestamp,
                type: 'post',
              }
            : null; // Ignore if no matching post is found
        } else if (chat.chattext) {
          // If the chat entry contains chattext, treat it as a chat
          return {
            senderId: chat.senderId,
            chattext: chat.chattext,
            timestamp: chat.timestamp,
            type: 'chat',
          };
        }
        return null; // Ignore invalid entries
      })
      .filter((item) => item !== null); // Remove null entries
    // Sort the merged array by timestamp
    this.filteredPosts.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }

  //  Finds a user by sender ID

  getUserBySenderId(senderId: string): userdetails | undefined {
    return this.userdetails.find((user) => user.userid === senderId);
  }

  // Adds unique users to matchedUsers array

  addUniqueUsers(newUsers: userdetails[]) {
    newUsers.forEach((user) => {
      if (
        !this.matchedUsers.some((existing) => existing.userid === user.userid)
      ) {
        this.matchedUsers.push(user);
      }
    });
  }

  // Gets user details from a chat pair

  getUserDetailsFromPair(pair: string): userdetails | undefined {
    const [user1, user2] = pair.split('+');
    this.otherUserId = this.localId === user1 ? user2 : user1;
    return this.userdetails.find((user) => user.userid === this.otherUserId);
  }

  //  Checks if the logged-in user is in the chat pair

  isUserInChatPair(pair: string): boolean {
    const [user1, user2] = pair.split('+');
    return user1 === this.localId || user2 === this.localId;
  }

  satting(pair: string) {
    const [user1, user2] = pair.split('+'); // Extract user IDs
    const receiverId = user1 === this.localId ? user2 : user1; // Determine receiver ID

    this.authservice.chatsapi(this.chattxt, receiverId).subscribe({
      next: (res) => {
        console.log('chat message sent successfully:', res);

        // After sending the message, refresh the chat history
        this.chattxt = '';
        this.loadChatHistory(pair);
      },
      error: (err) => {
        console.error('Error sending message:', err);
      },
    });
  }

  loadLastMessages() {
    if (!this.chatPairs || this.chatPairs.length === 0) {
      console.warn('No chat pairs available.');
      return;
    }

    this.chatPairs.forEach((pair) => {
      this.authservice.getLastChatMessage(pair).subscribe({
        next: (lastMessage) => {
          this.lastMessages[pair] = lastMessage?.chattext || 'Shared a Post';
          this.lastMsgsender[pair] = lastMessage?.senderId;
          this.lastMsgreciver[pair] = lastMessage?.receiverId;
        },
        error: (err) =>
          console.error(`Error fetching last message for ${pair}:`, err),
      });
    });
  }

  startChat(user: userdetails) {
    const senderId = localStorage.getItem('localId') ?? '';

    if (!senderId) {
      console.error('Error: senderId is null. User is not logged in.');
      return;
    }

    const receiverId = user.userid; // Get the clicked user's ID

    // Create a sorted chat pair
    const chatPair =
      senderId < receiverId
        ? `${senderId}+${receiverId}`
        : `${receiverId}+${senderId}`;

    // Call API to create chat pair if not already created
    this.authservice.chatsapi(this.chattxt, receiverId).subscribe({
      next: () => {
        console.log('Chat pair created successfully');

        // Add to chatPairs list if not already present
        if (!this.chatPairs.includes(chatPair)) {
          this.chatPairs.push(chatPair);
        }

        // Open chat modal
        this.loadChatHistory(chatPair);
      },
      error: (err) => console.error('Error creating chat pair:', err),
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

  ngAfterViewChecked() {
    const chatContainer = document.querySelector('.chat-history');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }

  getSmartDate(timestamp: string): string {
    const now = moment();
    const date = moment(timestamp);

    if (now.isSame(date, 'day')) {
      return 'Today,' + date.format(' hh:mm A');
    } else if (moment().subtract(1, 'day').isSame(date, 'day')) {
      return 'Yesterday at ' + date.format('hh:mm A');
    } else if (now.isSame(date, 'week')) {
      return date.format('dddd[,] hh:mm A');
    } else if (now.isSame(date, 'year')) {
      return date.format('MMM D[,] hh:mm A');
    } else {
      return date.format('MMM D, YYYY[,] hh:mm A');
    }
  }
}
