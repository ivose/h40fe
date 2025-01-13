import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SignupDto } from '../../models/signup-dto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupData: SignupDto = {
    email: '',
    password: '',
    fullName: '',
    username: '',
    born: ''
  };
  error = '';
  message = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) { }

  isValid(): boolean {
    return Boolean(this.signupData.email) &&
      Boolean(this.signupData.password) &&
      Boolean(this.signupData.fullName) &&
      Boolean(this.signupData.username) &&
      Boolean(this.signupData.born);
  }

  onSubmit() {
    if (this.isValid()) {
      this.loading = true;
      this.authService.signup(this.signupData).subscribe({
        next: () => {
          this.loading = false;
          this.message = 'Signup successful, email confirmation messag sent to your email';
          this.router.navigate(['/login'])
        },
        error: (error) => {
          this.error = error.error.name;
          this.loading = false;
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }
}
