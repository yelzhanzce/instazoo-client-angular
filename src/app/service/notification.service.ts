import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackbar: MatSnackBar) { }

  public showSnackBar(message: string, action: string): void{
    this.snackbar.open(message, action, {
      duration: 2000
    });
  }
}