import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  userData: any = {
    firstname: '',
    lastname: '',
    Username: '',
    bio: '',
    profilePicture: '',
  };

  firebaseId: string = '';
  isEditMode = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const localId = localStorage.getItem('localId');

    if (localId) {
      this.authService.getuserdata().subscribe({
        next: (res) => {
          // Filter user by localId (userid field)
          const matchedUser = res.find((user: any) => user.userid === localId);

          if (matchedUser) {
            this.userData = matchedUser;
            this.firebaseId = matchedUser.id; // Save Firebase key for update
            this.isEditMode = true;
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        },
      });
    }
  }

  onSubmit(form: NgForm) {
    const formData = form.value;

    // Store to localStorage
    localStorage.setItem('Username', formData.Username);
    localStorage.setItem('profilePicture', formData.profilePicture);

    if (this.isEditMode) {
      this.authService
        .updateUserInFirebase(this.firebaseId, {
          ...formData,
          userid: localStorage.getItem('localId'),
        })
        .subscribe({
          next: () => {
            console.log('User updated');
            this.router.navigate(['/myaccount']);
          },
          error: (err) => {
            console.error('Error updating user:', err);
          },
        });
    } else {
      this.authService
        .aftersignup(
          formData.firstname,
          formData.lastname,
          formData.Username,
          formData.bio,
          formData.profilePicture
        )
        .subscribe({
          next: () => {
            console.log('Signup complete');
            this.router.navigate(['/myaccount']);
            this.authService.authentication();
          },
          error: (err) => {
            console.error('Signup failed:', err);
          },
        });
    }
  }
}
