import { Injectable } from '@angular/core';
import {ErrorHandler} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorService implements ErrorHandler {
  handleError(error: any): void {
    //Handle error globally
    console.log("Global Error Handled: \n" + error);
  }
}
