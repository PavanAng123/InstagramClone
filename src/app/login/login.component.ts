import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { authresponse, AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { userdetails } from '../myaccount/myaccount.model';

@Component({
  selector: 'app-login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponentComponent {
  error?: string;
  userdata: userdetails[] = [];
  constructor(private authService: AuthService, private router: Router) {}
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log('formsubmitted');

    const email = form.value.email;
    const password = form.value.password;

    // this.authService.loginservice(email, password).subscribe(
    //   (res) => {
    //     console.log(res);
    //     console.log(res.localId);
    //     const localId = res.localId;
    //     localStorage.setItem('localId', localId);
    //     this.prouser();
    //     this.router.navigate(['/myaccount']);
    //   },
    //   (errormessage) => {
    //     console.log(errormessage);
    //     this.error = errormessage;
    //   }
  
    // );

    this.authService.loginservice(email, password).subscribe({
      next: (res) => {
        // Save required info (already done in service)
           const localId = res.localId;
           localStorage.setItem('localId', localId);
           this.prouser();
           this.router.navigate(['/myaccount']);
        console.log('Login successful');

        // ✅ Call authentication to trigger login state immediately
        this.authService.authentication();

      },
      error: (err) => {
        console.error('Login error:', err);
      },
    });

    
  }

  prouser() {
    const localId = localStorage.getItem('localId'); // The logged-in user's ID
    console.log(localId+ '11')
    if (!localId) {
      console.error(
        'No localId found in localStorage. User might not be l ogged in.'
      );
      return;
    }

    this.authService.getuserdata().subscribe({
      next: (userdetailsArray) => {
        // Find the user matching the logged-in localId
        const loggedInUser = userdetailsArray.find(
          (userdetails) => userdetails.userid === localId
        );
        console.log(userdetailsArray , 'details');
        if (loggedInUser) {
          // Save username and profilePicture to localStorage
          localStorage.setItem('Username', loggedInUser.Username);
          localStorage.setItem('profilePicture', loggedInUser.profilePicture);

          console.log('User details fetched and stored:', loggedInUser);
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
  }

  Tosignup() {
    this.router.navigate(['/signup']);
    return;
  }
}
 

