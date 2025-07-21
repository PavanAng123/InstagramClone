import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.scss'],
})
export class ResponseComponent {
  localId: string | null = null;
  userdetails: any[] = [];
  selectedFile: File | null = null;

  constructor(private authservice: AuthService) {} 


  ngOnInit() {
    this.fetchUsers();
    this.localId = localStorage.getItem('localId');
  }

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
}

