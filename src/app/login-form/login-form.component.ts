import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  constructor (private authservice: AuthService, private router: Router){}

  onSubmit(form: NgForm) { 
    const firstname = form.value.firstname;
    const lastname = form.value.lastname;
    const Username = form.value.Username;
    const bio = form.value.bio;
    const profilePicture = form.value.profilePicture;

    localStorage.setItem('Username', Username);
    localStorage.setItem('profilePicture', profilePicture);
    
    this.authservice
      .aftersignup(firstname, lastname, Username, bio, profilePicture)
      .subscribe({
        
        next: (res) => {
          console.log(res);
          this.router.navigate(['/myaccount']);
        },
        error: (err) => {
          console.error('Error during signup:', err);
        },
      });
    
    }

  }

  

