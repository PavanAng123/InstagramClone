import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
constructor(private router:Router){}

  logout() {
    localStorage.removeItem('localId');
    this.router.navigate(['/login']);
    const id = localStorage.getItem('localId')
    console.log(id)
    localStorage.removeItem('Username');
    localStorage.removeItem('profilePicture');
    localStorage.clear();
  }
}
