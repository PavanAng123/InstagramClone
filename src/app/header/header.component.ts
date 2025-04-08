import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  localId!: string | null;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}
   ngOnInit(): void {
    this.localId = localStorage.getItem('localId');
  this.authService.isLoggedIn$.subscribe((status) => {
    this.isLoggedIn = status;
  });
   
  }
  logout() {
    localStorage.removeItem('localId');
    this.router.navigate(['/login']);
    localStorage.removeItem('Username');
    localStorage.removeItem('profilePicture');
    localStorage.clear();
    this.authService.logout();
  }
}
