import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private showDelay = 1000; // Show loader after 1s if API is still loading
  private timeoutId: any = null;
  private loaderVisible = false;

  show() {
    // Reset any previous timeout to avoid conflicts
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Start timer to show the spinner after 1s
    this.timeoutId = setTimeout(() => {
      this.loadingSubject.next(true);
      this.loaderVisible = true;
    }, this.showDelay);
  }

  hide() {
    // Cancel the pending timeout if it's still waiting
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    // Hide the spinner only if it was actually shown
    if (this.loaderVisible) {
      this.loadingSubject.next(false);
      this.loaderVisible = false;
    }
  }
}
