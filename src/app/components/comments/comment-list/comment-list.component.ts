// src/app/components/comments/comment-list/comment-list.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentService } from '../../../services/comment.service';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { CommentNewComponent } from '../comment-new/comment-new.component';
import { CommentDetail } from '../../../models/comment-detail.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [
    CommonModule,
     CommentItemComponent,
      CommentNewComponent,
      RouterLink
    ],
  template: `
    <div class="comments-section">
      <h3 class="mb-4">Comments ({{comments.length}})</h3>
      
      <app-comment-new 
        [postId]="postId" 
        (commentAdded)="onCommentAdded($event)">
      </app-comment-new>

      @if (loading) {
        <div class="text-center my-4">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (comments.length === 0) {
        <p class="text-muted">No comments yet. Be the first to comment!</p>
      } @else {
        <div class="comment-list mt-4">
          @for (comment of comments; track comment.id) {
            <app-comment-item 
              [comment]="comment"
              (deleted)="onCommentDeleted($event)">
            </app-comment-item>
          }
        </div>
      }
    </div>
  `
})
export class CommentListComponent implements OnInit {
  @Input() postId!: number;
  comments: CommentDetail[] = [];
  loading = true;
  error = '';

  constructor(private commentService: CommentService) {}

  ngOnInit() {
    if (this.postId) {
      this.loadComments();
    } else {
      this.error = 'No post ID provided';
      this.loading = false;
    }
  }

  loadComments() {
    const pageable = { page: 0, size: 20 }; // You can adjust size as needed
    this.commentService.getPostComments(this.postId, pageable).subscribe({
      next: (response) => {
        this.comments = response.content;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error loading comments';
        this.loading = false;
        console.error('Error loading comments:', error);
      }
    });
  }

  onCommentAdded(newComment: CommentDetail) {
    this.comments = [newComment, ...this.comments];
  }

  onCommentDeleted(commentId: number) {
    this.comments = this.comments.filter(c => c.id !== commentId);
  }
}