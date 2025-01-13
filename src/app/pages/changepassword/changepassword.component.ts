import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss'
})
export class ChangepasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  isValid(): boolean {
    return Boolean(this.oldPassword) &&
      Boolean(this.newPassword) &&
      Boolean(this.confirmPassword) &&
      this.newPassword === this.confirmPassword;
  }

  onSubmit() {
    if (this.isValid()) {
      this.authService.changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }).subscribe({
        next: () => this.router.navigate(['/profile']),
        error: (error) => {
          this.error = error.error.name;
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }
}
