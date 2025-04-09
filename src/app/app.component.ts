import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'applicationclone';

  constructor(
    private authService: AuthService,
    private loading: LoadingService
  ) {}
  ngOnInit() {
    this.loading.show();
    this.authService.authentication();
    this.loading.hide();
  }
}
