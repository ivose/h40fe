import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  languages = [
    { code: 'en', name: 'English' },
    { code: 'et', name: 'Eesti' },
    { code: 'fi', name: 'Suomi' }
  ];
  isLoggedIn = false;
  showDropdown = false;
  showAdminDropdown = false;
  searchQuery = '';
  currentUser: any = null;
  isAdmin = false;
  isSearchVisible = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService
  ) { 
    translate.setDefaultLang('en');
    translate.use('en');
  }

  changeLanguage(langCode: string) {

    this.translate.use(langCode);
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      this.isAdmin = user?.user?.admin || false;
      this.searchQuery = "";
    });
    this.router.events.subscribe(() => {
      this.checkSearchVisibility();
    });
    this.route.queryParams.subscribe((params: Params) => {
      this.searchQuery = params['search'] || '';
    });
  }

  checkSearchVisibility() {
    const searchableRoutes = [
      '/',
      '/users',
      '/my-posts',
      '/feed'
    ];
    this.isSearchVisible = searchableRoutes.some(route =>
      this.router.url === route || this.router.url.startsWith(`${route}?`)
    );
  }

  onSearch(event: Event) {
    event.preventDefault();

    const currentUrl = this.router.url;

    if (currentUrl === '/' || currentUrl.startsWith('/?')) {
      this.searchPosts();
    } else if (currentUrl === '/users' || currentUrl.startsWith('/users?')) {
      this.searchUsers();
    } else if (currentUrl === '/my-posts' || currentUrl.startsWith('/my-posts?')) {
      this.searchMyPosts();
    } else if (currentUrl === '/feed' || currentUrl.startsWith('/feed?')) {
      this.searchFeed();
    }
  }

  private searchPosts() {
    this.router.navigate(['/'], {
      queryParams: { search: this.searchQuery },
      queryParamsHandling: 'merge'
    });
  }

  private searchUsers() {
    this.router.navigate(['/users'], {
      queryParams: { search: this.searchQuery },
      queryParamsHandling: 'merge'
    });
  }

  private searchMyPosts() {
    this.router.navigate(['/my-posts'], {
      queryParams: { search: this.searchQuery },
      queryParamsHandling: 'merge'
    });
  }

  private searchFeed() {
    this.router.navigate(['/feed'], {
      queryParams: { search: this.searchQuery },
      queryParamsHandling: 'merge'
    });
  }

  logout() {
    this.authService.logout();
    //this.router.navigate(['/']);
    window.location.href = '/';
  }
}
