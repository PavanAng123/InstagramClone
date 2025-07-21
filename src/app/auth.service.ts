import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import { comntdata, Posts } from './displayposts/displayposts.model';
import { userdetails } from './myaccount/myaccount.model';
import { selectLocalId } from './auth.selector';
import { Store } from '@ngrx/store';
import { ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Storage } from '@angular/fire/storage';


export interface authresponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  profilePicture: any;
  Username: any;

  // BehaviorSubject to store the authentication state
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  // Expose the observable (so other components can subscribe)
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
  localId!: any;
  constructor(
    private httpclient: HttpClient,
    private router: Router,
    private store: Store,
    private storage: Storage // Inject Angular Fire Storage
  ) {}
  getlocalidfrmstr() {
    this.store.select(selectLocalId).subscribe((localId) => {
      this.localId = localId;
      console.log(localId + ' from store');
    });
  }

  // Method to log in (You can replace this with real authentication logic)
  login() {
    this.isLoggedInSubject.next(true); // Set login state to true
    this.getlocalidfrmstr();
    console.log('from auth service');
  }

  // Method to log out
  logout() {
    this.isLoggedInSubject.next(false); // Set login state to false
  }
  public loginservice(email: any, password: any) {
    const api =
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBeL2hSsZFJuWKJR39p2GuijjkNrvPZ2m4';
    let payload = {
      email: email,
      password: password,
    };
    return this.httpclient
      .post<authresponse>(api, payload)
      .pipe(catchError(this.handlerror));
  }

  signup(email: string, password: string) {
    return this.httpclient
      .post<authresponse>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBeL2hSsZFJuWKJR39p2GuijjkNrvPZ2m4',
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(catchError(this.handlerror));
  }

  aftersignup(
    firstname: string,
    lastname: string,
    Username: string,
    bio: string,
    profilePicture: any
  ) {
    const localId = localStorage.getItem('localId');
    this.profilePicture = profilePicture;
    this.Username = Username;
    console.log(localId);
    return this.httpclient.post(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/aftersignup.json',
      {
        firstname: firstname,
        lastname: lastname,
        Username: Username,
        bio: bio,
        userid: localId,
        profilePicture: profilePicture,
      }
    );
  }

  updateUserInFirebase(firebaseId: string, updatedData: any) {
    return this.httpclient.patch(
      `https://application-clone-7f061-default-rtdb.firebaseio.com/aftersignup/${firebaseId}.json`,
      updatedData
    );
  }

  savePostsInfo(title: string, content: string, imageurl: string) {
    const localId = localStorage.getItem('localId');
    const Username = localStorage.getItem('Username');
    const profilePicture = localStorage.getItem('profilePicture');
    console.log(Username + 'post');
    console.log(profilePicture);
    return this.httpclient.post(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/createposts.json',
      {
        title: title,
        content: content,
        imageurl: imageurl,
        userid: localId,
        Username: Username,
        profilePicture: profilePicture,
      }
    );
  }



  uploadImage(file: File): Promise<string> {
    const filePath = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath); // Create a reference to the file in Firebase Storage
    return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef)); // Upload the file and return the download URL
  }

  modifyPostsInfo(postId: string, payload: any) {
    const localId = localStorage.getItem('localId');
    const Username = localStorage.getItem('Username');
    const profilePicture = localStorage.getItem('profilePicture');

    console.log(Username + ' modifying post');
    console.log(profilePicture);

    const url = `https://application-clone-7f061-default-rtdb.firebaseio.com/createposts/${postId}.json`;

    return this.httpclient.patch(url, {
      title: payload.title,
      content: payload.content,
      imageurl: payload.imageurl,
      userid: localId,
      Username: Username,
      profilePicture: profilePicture,
    });
  }

  deleteCommentById(commentId: string) {
    return this.httpclient.delete(
      `https://application-clone-7f061-default-rtdb.firebaseio.com/cmntforpst/${commentId}.json`
    );
  }

  deleteCommentFromDB(commentId: string) {
    return this.httpclient.delete(
      `https://application-clone-7f061-default-rtdb.firebaseio.com/cmntforpst/${commentId}.json`
    );
  }

  deletePostById(postId: string) {
    return this.httpclient.delete(
      `https://application-clone-7f061-default-rtdb.firebaseio.com/createposts/${postId}.json`
    );
  }

  getposts(): Observable<Posts[]> {
    return this.httpclient.get<Posts[]>(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/createposts.json'
    );
  }

  getuserposts(): Observable<Posts[]> {
    const localId = localStorage.getItem('localId');

    return this.httpclient
      .get<Posts[]>(
        'https://application-clone-7f061-default-rtdb.firebaseio.com/createposts.json'
      )
      .pipe(
        map((data: any) => {
          // Filter posts to show only those created by the logged-in user
          console.log(data);
          return Object.entries(data)
            .map(([key, value]: any) => ({
              id: key,
              ...value,
            }))
            .filter((post: any) => post.userid === localId);
        })
      );
  }

  getSearchUserPosts(userId: string): Observable<any> {
    return this.httpclient
      .get(
        `https://application-clone-7f061-default-rtdb.firebaseio.com/createposts.json`
      )
      .pipe(
        map((data: any) => {
          // Filter posts to show only those created by the logged-in user
          console.log(data);
          return Object.entries(data)
            .map(([key, value]: any) => ({
              id: key,
              ...value,
            }))
            .filter((post: any) => post.userid === userId);
        })
      );
  }

  getuserdata(): Observable<userdetails[]> {
    const localId = localStorage.getItem('localId');
    this.getlocalidfrmstr();

    return this.httpclient
      .get<userdetails[]>(
        'https://application-clone-7f061-default-rtdb.firebaseio.com/aftersignup.json'
      )
      .pipe(
        map((data: any) => {
          console.log(data, 'api');
          return Object.entries(data)
            .map(([key, value]: any) => ({
              id: key,
              ...value,
            }))
            .filter((userdetails: any) => userdetails.userid === localId);
        })
      );
  }
  getusers(): Observable<userdetails[]> {
    return this.httpclient.get<userdetails[]>(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/aftersignup.json'
    );
  }

  likesApi(updatedData: any) {
    return this.httpclient.put(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/createposts.json',
      updatedData
    );
  }
  commentApi(comment: string, postId: string) {
    const localId = localStorage.getItem('localId');
    const Username = localStorage.getItem('Username');
    const profilePicture = localStorage.getItem('profilePicture');
    console.log(Username + 'post');
    console.log(profilePicture);
    return this.httpclient.post(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/cmntforpst.json',
      {
        Username: Username,
        profilePicture: profilePicture,
        userId: localId,
        comment: comment,
        postId: postId,
      }
    );
  }

  getcomnts(): Observable<comntdata[]> {
    return this.httpclient.get<comntdata[]>(
      'https://application-clone-7f061-default-rtdb.firebaseio.com/cmntforpst.json'
    );
  }

  savePostShare(postId: string, receiverId: string): Observable<any> {
    const senderId = localStorage.getItem('localId') ?? '';

    if (!senderId) {
      console.error('Error: senderId is null. User is not logged in.');
      return new Observable((observer) => {
        observer.error(new Error('senderId is null. Cannot share post.'));
      });
    }

    // Sort sender and receiver IDs to maintain consistency
    const firstId = senderId < receiverId ? senderId : receiverId;
    const secondId = senderId < receiverId ? receiverId : senderId;

    return this.httpclient.post(
      `https://application-clone-7f061-default-rtdb.firebaseio.com/chats/${firstId}+${secondId}.json`,
      {
        postId: postId,
        senderId: senderId,
        receiverId: receiverId,
        timestamp: new Date().toISOString(), // Adding timestamp for ordering
      }
    );
  }

  chatsapi(chattext: string, receiverId: string): Observable<any> {
    const senderId = localStorage.getItem('localId') ?? '';

    if (!senderId) {
      console.error('Error: senderId is null. User is not logged in.');
      return new Observable((observer) => {
        observer.error(new Error('senderId is null. Cannot share post.'));
      });
    }

    // Sort sender and receiver IDs to maintain consistency
    const firstId = senderId < receiverId ? senderId : receiverId;
    const secondId = senderId < receiverId ? receiverId : senderId;

    return this.httpclient.post(
      `https://application-clone-7f061-default-rtdb.firebaseio.com/chats/${firstId}+${secondId}.json`,
      {
        chattext: chattext,
        senderId: senderId,
        receiverId: receiverId,
        timestamp: new Date().toISOString(), // Adding timestamp for ordering
      }
    );
  }

  getLastChatMessage(pair: string): Observable<any> {
    return this.httpclient
      .get<{ [key: string]: any }>(
        `https://application-clone-7f061-default-rtdb.firebaseio.com/chats/${pair}.json`
      )
      .pipe(
        map((response) => {
          if (!response) return null; // Handle no chat data

          // Convert response object into an array
          const messages = Object.values(response);

          // Sort messages by timestamp in descending order (latest first)
          messages.sort(
            (a: any, b: any) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );

          return messages.length > 0 ? messages[0] : null; // Return latest message
        }),
        catchError((error) => {
          console.error('Error fetching last message:', error);
          return of(null);
        })
      );
  }

  // Fetch chat pairs (unique user combinations)
  getChatPairs(skipLoader: boolean = false): Observable<string[]> {
    const headers = skipLoader
      ? new HttpHeaders({ 'X-Skip-Loader': 'true' })
      : new HttpHeaders(); // instead of undefined
    return this.httpclient
      .get<{ [key: string]: any }>(
        `https://application-clone-7f061-default-rtdb.firebaseio.com/chats.json`,
        { headers }
      )
      .pipe(
        map((data) => {
          if (!data) return [];

          // Extract chat pair keys (e.g., "userA+userB", "userB+userC")
          return Object.keys(data);
        }),
        catchError(() => of([]))
      );
  }

  // Fetch chat history between two users
  getChatHistory(
    user1: string,
    user2: string,
    skipLoader: boolean = false
  ): Observable<any[]> {
    const headers = skipLoader
      ? new HttpHeaders({ 'X-Skip-Loader': 'true' })
      : new HttpHeaders(); // instead of undefined
    // Ensure ID ordering remains consistent
    const firstId = user1 < user2 ? user1 : user2;
    const secondId = user1 < user2 ? user2 : user1;

    return this.httpclient
      .get<{ [key: string]: any }>(
        `https://application-clone-7f061-default-rtdb.firebaseio.com/chats/${firstId}+${secondId}.json`,
        { headers }
      )
      .pipe(
        map((data) => {
          if (!data) return [];
          return Object.values(data).sort(
            (a: any, b: any) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }),
        catchError(() => of([]))
      );
  }

  authentication() {
    const user = localStorage.getItem('localId');
    if (user) {
      this.login();
      return true;
    } else {
      this.isLoggedInSubject.next(false); // In case of logout or missing ID
      this.router.navigate(['/login']);
      return false;
    }
  }

  private handlerror(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred. Please try again.';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => new Error(errorMessage));
    }

    const serverMessage = errorRes.error.error.message;

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email already exists. Try logging in instead.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'No account found with this email.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password you entered is incorrect.';
        break;
      case 'USER_DISABLED':
        errorMessage =
          'This user account has been disabled by the administrator.';
        break;

      default:
        errorMessage = serverMessage || errorMessage;
        break;
    }

    return throwError(() => new Error(errorMessage));
  }
}
