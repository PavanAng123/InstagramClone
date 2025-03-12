import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  errormsg?: string;

  constructor(private authservice: AuthService, private router: Router) {}
  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    console.log('SignupForm Submitted');

    const email = form.value.Email;
    const password = form.value.password;

    this.authservice.signup(email, password).subscribe(
      (res) => {
        console.log(res);
       
        const localId = res.localId;
        localStorage.setItem('localId', localId);
        this.router.navigate(['/loginForm']);
      },
      (errormessage) => {
        console.log(errormessage);
        this.errormsg = errormessage;
      }
    );
  }

  navigatelogin() {
    this.router.navigate(['/login'])
  }
}
