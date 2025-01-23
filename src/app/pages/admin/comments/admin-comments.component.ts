// src/app/pages/admin/comments/admin-comments.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminCommentService } from '../../../services/admin/admin-comment.service';
import { Comment } from '../../../models/comment.model';
import { PageableParams } from '../../../models/pageable-params.model';
import { PaginationComponent } from '../../../components/pagination/pagination.component';
import { AdminCommentsItemComponent } from './admin-comments-item/admin-comments-item.component';
import { AdminCommentsFormComponent } from './admin-comments-form/admin-comments-form.component';

@Component({
  selector: 'app-admin-comments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PaginationComponent,
    AdminCommentsItemComponent,
    AdminCommentsFormComponent
  ],
  templateUrl: './admin-comments.component.html',
  styleUrls: ['./admin-comments.component.scss']
})
export class AdminCommentsComponent implements OnInit {
  comments: Comment[] = [];
  currentPage = 1;
  pageSize = 10;
  totalElements = 0;
  searchQuery = '';
  loading = false;
  error = '';
  showModal = false;
  editingComment: Comment | null = null;

  constructor(private adminCommentService: AdminCommentService) { }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.loading = true;
    const pageable = new PageableParams(this.currentPage - 1, this.pageSize, ['createdAt,desc']);

    this.adminCommentService.getAllComments(this.searchQuery, undefined, pageable)
      .subscribe({
        next: (response) => {
          this.comments = response.content;
          this.totalElements = response.totalElements;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading comments:', err);
          this.error = 'Failed to load comments';
          this.loading = false;
        }
      });
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.currentPage = 1;
    this.loadComments();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadComments();
  }

  openEditModal(comment: Comment) {
    this.editingComment = comment;
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.editingComment = null;
    this.error = '';
  }

  onSaveComment(data: { content: string }) {
    if (this.editingComment) {
      this.adminCommentService.updateComment(this.editingComment.id, data.content)
        .subscribe({
          next: () => {
            this.closeModal();
            this.loadComments();
          },
          error: (err) => {
            console.error('Error updating comment:', err);
            this.error = err.error?.message || 'Failed to update comment';
          }
        });
    }
  }

  onDeleteComment(comment: Comment) {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.adminCommentService.deleteComment(comment.id)
        .subscribe({
          next: () => this.loadComments(),
          error: (err) => {
            console.error('Error deleting comment:', err);
            this.error = 'Failed to delete comment';
          }
        });
    }
  }
}