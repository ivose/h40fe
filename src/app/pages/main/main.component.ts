import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../models/post.model';
import { PageableParams } from '../../models/pageable-params.model';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { PostsItemComponent } from '../../components/posts/posts-item/posts-item.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PaginationComponent,
    PostsItemComponent
  ]
})
export class MainComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  pageTitle = 'Posts';
  currentUserId?: number;
  searchQuery = '';

  constructor(
    private postService: PostService,
    public router: Router,
    private route: ActivatedRoute,
    public authService: AuthService
  ) { }

  ngOnInit() {
    // Subscribe to route data and params changes
    this.route.data.subscribe(data => {
      if (data['type']) {
        this.setPageTitle(data['type']);
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.currentUserId = +params['id'];
      }
      this.loadPosts();
    });
    // Handle search query
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      if (this.searchQuery) {
        switch (this.router.url) {
          case '/my-posts':
          case '/my-posts?search=' + this.searchQuery:
            this.searchMyPosts();
            break;
          case '/feed':
          case '/feed?search=' + this.searchQuery:
            this.searchFeed();
            break;
          default:
            this.searchPosts();
        }
      } else {
        this.loadPosts();
      }
    });
  }

  setPageTitle(type: string) {
    switch (type) {
      case 'my-posts':
        this.pageTitle = 'My Posts';
        break;
      case 'feed':
        this.pageTitle = 'My Feed';
        break;
      case 'user-posts':
        this.pageTitle = 'User Posts';
        break;
      default:
        this.pageTitle = 'All Posts';
    }
  }

  loadPosts() {
    this.loading = true;
    const pageParams = new PageableParams(this.currentPage - 1, this.pageSize);

    let request;

    // Determine which API call to make based on the current route
    const currentUrl = this.router.url;

    if (currentUrl.includes('/my-posts')) {
      request = this.postService.getMyPosts(pageParams);
    } else if (currentUrl.includes('/feed')) {
      request = this.postService.getUserFeed(pageParams);
    } else if (this.currentUserId && currentUrl.includes('/posts/user/')) {
      request = this.postService.getUserPosts(pageParams, this.currentUserId);
    } else {
      request = this.postService.getAllPosts(pageParams);
    }

    request.subscribe({
      next: (response) => {
        this.posts = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.loading = false;
      }
    });
  }

  searchPosts() {
    this.loading = true;
    const pageParams = new PageableParams(this.currentPage - 1, this.pageSize);

    this.postService.getAllPosts(pageParams).subscribe({
      next: (response) => {
        // Filter posts client-side if backend doesn't support search
        this.posts = response.content.filter(post =>
          post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.totalElements = this.posts.length;
        this.pageTitle = `Search Results for "${this.searchQuery}"`;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching posts:', error);
        this.loading = false;
      }
    });
  }

  searchMyPosts() {
    this.loading = true;
    const pageParams = new PageableParams(this.currentPage - 1, this.pageSize);

    this.postService.getMyPosts(pageParams).subscribe({
      next: (response) => {
        this.posts = response.content.filter(post =>
          post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.totalElements = this.posts.length;
        this.pageTitle = `My Posts Search Results for "${this.searchQuery}"`;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching my posts:', error);
        this.loading = false;
      }
    });
  }

  loadMyPosts() {
    this.loading = true;
    const pageParams = new PageableParams(this.currentPage - 1, this.pageSize);

    this.postService.getMyPosts(pageParams).subscribe({
      next: (response) => {
        this.posts = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading my posts:', error);
        this.loading = false;
      }
    });
  }

  loadFeed() {
    this.loading = true;
    const pageParams = new PageableParams(this.currentPage - 1, this.pageSize);

    this.postService.getUserFeed(pageParams).subscribe({
      next: (response) => {
        this.posts = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading feed:', error);
        this.loading = false;
      }
    });
  }

  searchFeed() {
    this.loading = true;
    const pageParams = new PageableParams(this.currentPage - 1, this.pageSize);

    this.postService.getUserFeed(pageParams).subscribe({
      next: (response) => {
        this.posts = response.content.filter(post =>
          post.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
        this.totalElements = this.posts.length;
        this.pageTitle = `Feed Search Results for "${this.searchQuery}"`;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error searching feed:', error);
        this.loading = false;
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // if (this.searchQuery) {
    //   this.searchPosts();
    // } else {
    //   this.loadPosts();
    // }
    switch (this.router.url) {
      case '/my-posts':
      case '/my-posts?search=' + this.searchQuery:
        if (this.searchQuery) {
          this.searchMyPosts();
        } else {
          this.loadMyPosts();
        }
        break;
      case '/feed':
      case '/feed?search=' + this.searchQuery:
        if (this.searchQuery) {
          this.searchFeed();
        } else {
          this.loadFeed();
        }
        break;
      default:
        if (this.searchQuery) {
          this.searchPosts();
        } else {
          this.loadPosts();
        }
    }
  }

  createPost() {
    this.router.navigate(['/posts/new']);
  }
}
