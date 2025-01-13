import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.scss'
})
export class ResetpasswordComponent implements OnInit {
  email = '';
  newPassword = '';
  confirmPassword = '';
  token = '';
  error = '';
  message = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }

  requestReset() {
    if (this.email) {
      this.error = '';
      this.message = '';
      this.loading = true;
      this.authService.forgotPassword({ email: this.email }).subscribe({
        next: () => {
          this.message = 'Reset link has been sent to your email';
          this.loading = false;
          setTimeout(() => {
            this.message = '';
            this.router.navigate(['/'])
          }, 5000);
        },
        error: (error) => {
          this.error = error.error.name;
          this.loading = false;
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  isValid(): boolean {
    console.log('---', this.newPassword, this.confirmPassword);
    return Boolean(this.newPassword) &&
      Boolean(this.confirmPassword) &&
      this.newPassword === this.confirmPassword;
  }

  confirmReset() {
    if (this.isValid()) {
      this.authService.resetPassword({
        token: this.token,
        newPassword: this.newPassword
      }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => {
          this.error = error.error.message;
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }
}
//http://yourdomain.com?token=N9I0gjRfaYC_deP8mfjDaAvBToTk1xQPjs3nD93TEBE=