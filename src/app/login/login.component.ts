import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { userdetails } from '../myaccount/myaccount.model';

import { Store } from '@ngrx/store';
import { loginFailure, loginSuccess, updateprofilepic, updateUsername } from '../auth.actions';
import { selectLocalId } from '../auth.selector';
import { filter, take } from 'rxjs';


@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponentComponent {
  error?: string;
  userdata: userdetails[] = [];
  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {}
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log('formsubmitted');

    const email = form.value.email;
    const password = form.value.password;

    this.authService.loginservice(email, password).subscribe({
      next: (res) => {
        const localId = res.localId;
        localStorage.setItem('localId', localId);
this.store.dispatch(loginSuccess({ localId }));

// Wait for the localId to appear in store before calling prouser
      this.store
        .select(selectLocalId).subscribe((id) => {
          this.prouser();
          this.router.navigate(['/myaccount']);
        });
        console.log('Login successful');
        this.authService.authentication();
      },
      error: (err) => {
        this.store.dispatch(loginFailure({ error: err }));
        console.error('Login error:', err);
      },
    });
  }

  prouser() {
    this.store.select(selectLocalId).subscribe((localId) => {
      console.log(localId + ' from store');

      if (!localId) {
        console.error(
          'No localId found in store. User might not be logged in.'
        );
        return;
      }

      this.authService.getuserdata().subscribe({
        next: (userdetailsArray) => {
          const loggedInUser = userdetailsArray.find(
            (userdetails) => userdetails.userid === localId
          );

          console.log(userdetailsArray, 'details');
          console.log('Looking for localId:', localId);

          if (loggedInUser) {
            this.store.dispatch(
              updateUsername({ username: loggedInUser.Username })
            );
            this.store.dispatch(
              updateprofilepic({ profilepic: loggedInUser.profilePicture })
            );
            localStorage.setItem('Username', loggedInUser.Username);
            localStorage.setItem('profilePicture', loggedInUser.profilePicture);
            console.log('User found:', loggedInUser);
          } else {
            console.error('No user found with the matching localId.');
            localStorage.removeItem('Username');
            localStorage.removeItem('profilePicture');
          }
        },
        error: (err) => {
          console.error('Error fetching user details:', err);
        },
      });
    });
  }

  Tosignup() {
    this.router.navigate(['/signup']);
    return;
  }
}
 

