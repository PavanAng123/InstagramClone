// loading.interceptor.ts
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { LoadingService } from './loading.service';


@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
const skipLoader = req.params.get('skipLoader') === 'true';

    if (!skipLoader) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!skipLoader) {
          this.loadingService.hide();
        }
      })
    );
  }
}

