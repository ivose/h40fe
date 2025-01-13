import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    // Clear any existing auth data on component load
    this.authService.logout();
  }

  onSubmit() {
    this.loading = true;
    this.authService.login({ username: this.username, password: this.password })
      .subscribe({
        next: (response) => {
          this.authService.currentUserSubject.next(response);
          window.location.reload();
          window.location.href = '/';
        },
        error: (error) => {
          this.error = error.error.name;
          setTimeout(() => this.error = '', 5000);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
