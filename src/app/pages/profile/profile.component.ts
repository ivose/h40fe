import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateProfileDTO } from '../../models/user-profile-model.model';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  error = '';
  profile: UpdateProfileDTO = {
    email: '',
    fullName: '',
    username: '',
    born: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getMe().subscribe({
      next: (response) => {
        this.profile = {
          email: response.user.email,
          username: response.user.username,
          fullName: response.user.fullName,
          born: new Date(response.user.born).toISOString().split('T')[0]
        };
      },
      error: (error) => {
        this.error = error.error.name;
        setTimeout(() => this.error = '', 5000);
      }
    });
  }

  onSubmit() {
    this.authService.updateProfile(this.profile).subscribe({
      next: () => console.log('Profile updated successfully'),
      error: (error) => console.error('Profile update failed:', error)
    });
  }
}
