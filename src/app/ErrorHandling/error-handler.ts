import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements ErrorHandler {
  constructor() {}

  handleError(error: any): string {
    if (error instanceof HttpErrorResponse) {
      //handle HTTP errors
      return this.HandleHTTPError(error);
    } else if (error instanceof Error) {
      //handle client side errors
      console.error('Client-side error: ', error.message);
    } else {
      //handle unexpected errors
      console.error('Unexpected errro: ', error.message);
    }
    return error.message;
  }

  private HandleHTTPError(error: HttpErrorResponse): string {
    console.error('http error', error);
    return this.getHttpErrorMessage(error);
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 409:
        return error.error.message;
      case 500:
        return 'Server error. Please try again later.';
      case 404:
        return error.error.message;
      case 401:
        return error.error.message;
      default:
        return 'Unexpected error occured.';
    }
  }
}
