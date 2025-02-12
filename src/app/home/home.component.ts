import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Service/Auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,

  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    this.getUserID();
  }

  getUserID() {
    console.log(this.authService.getUserId());
  }
}
