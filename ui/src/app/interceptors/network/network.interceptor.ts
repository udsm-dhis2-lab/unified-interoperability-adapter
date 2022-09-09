import { UiService } from 'src/app/services/ui.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class NetworkInterceptor implements HttpInterceptor {

  constructor(
    private uiService: UiService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.uiService.show();
    return next.handle(request).pipe(
      finalize(
        () => {
          this.uiService.hide();
        })
    );
  }
}
