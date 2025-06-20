import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// PUBLIC_INTERFACE
@Injectable({ providedIn: 'root' })
export class ErrorService {
  public error$ = new Subject<string>();

  show(message: string) {
    this.error$.next(message);
  }

  clear() {
    this.error$.next('');
  }
}
