import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  showDropdown = false;
  searchQuery = '';
  currentUser: any = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
    });
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.showDropdown = false;
  }

  onSearch(event: Event) {
    event.preventDefault();
    console.log('Searching for:', this.searchQuery);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
