import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { PageableParams } from '../../models/pageable-params.model';
import { PaginationComponent } from '../pagination/pagination.component';
import { PostsItemComponent } from './posts-item/posts-item.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, PaginationComponent, PostsItemComponent],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  posts: Post[] = [];
  loading = false;
  pageTitle = 'Posts';
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  type: string = 'all';
  userId: number = 0;

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.type = data['type'] || 'all';
      this.setPageTitle();
    });

    this.route.params.subscribe(params => {
      if (params['id'] && isNaN(+params['id']) === false) {
        this.userId = +params['id'];
      }
      this.loadPosts();
    });
  }

  setPageTitle() {
    switch(this.type) {
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
    switch(this.type) {
      case 'my-posts':
        request = this.postService.getMyPosts(pageParams);
        break;
      case 'feed':
        request = this.postService.getUserFeed(pageParams);
        break;
      case 'user-posts':
        request = this.postService.getUserPosts(pageParams, this.userId);
        break;
      default:
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

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts();
  }

  createPost() {
    this.router.navigate(['/posts/new']);
  }
}