import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _snackBar = inject(MatSnackBar);

  constructor() {}
  showNotification(message: string, duration: number = 2000) {
    this._snackBar.open(message, 'Done', {
      duration: duration,
    });
  }
}
