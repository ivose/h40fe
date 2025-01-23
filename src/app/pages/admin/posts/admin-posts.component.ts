// src/app/pages/admin/posts/admin-posts/admin-posts.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminPostService } from '../../../services/admin/admin-post.service';
import { Post } from '../../../models/post.model';
import { PageableParams } from '../../../models/pageable-params.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { AdminPostsItemComponent } from './admin-posts-item/admin-posts-item.component';
import { AdminPostsFormComponent } from './admin-posts-form/admin-posts-form.component';

@Component({
  selector: 'app-admin-posts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    AdminPostsItemComponent,
    AdminPostsFormComponent
  ],
  templateUrl: './admin-posts.component.html',
  styleUrls: ['./admin-posts.component.scss']
})
export class AdminPostsComponent implements OnInit {
  posts: Post[] = [];
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  searchQuery = '';
  loading = false;
  error = '';
  showModal = false;
  editingPost: Post | null = null;
  sortBy = '';

  constructor(private adminPostService: AdminPostService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    const pageable = new PageableParams(this.currentPage - 1, this.pageSize, ['title']);

    this.adminPostService.getAllPosts(this.searchQuery, undefined, this.sortBy, pageable)
      .subscribe({
        next: (response) => {
          this.posts = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading posts:', err);
          this.error = 'Failed to load posts';
          this.loading = false;
        }
      });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadPosts();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPosts();
  }

  onSortChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.sortBy = select.value;
    this.loadPosts();
  }

  openEditModal(post: Post) {
    this.editingPost = post;
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.editingPost = null;
    this.error = '';
  }

  onSavePost(postData: { title: string; content: string }) {
    if (this.editingPost) {
      this.adminPostService.updatePost(this.editingPost.id, postData)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadPosts();
          },
          error: (err) => {
            console.error('Error updating post:', err);
            this.error = err.error?.message || 'Failed to update post';
          }
        });
    }
  }

  onDeletePost(post: Post) {
    if (confirm(`Are you sure you want to delete post "${post.title}"?`)) {
      this.adminPostService.deletePost(post.id)
        .subscribe({
          next: () => this.loadPosts(),
          error: (err) => {
            console.error('Error deleting post:', err);
            this.error = 'Failed to delete post';
          }
        });
    }
  }
}