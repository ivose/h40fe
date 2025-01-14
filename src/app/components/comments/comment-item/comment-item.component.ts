import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CommentService } from '../../../services/comment.service';
import { CommentDetail } from '../../../models/comment-detail.model';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="comment-item border-bottom py-3">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <div class="fw-bold">{{ comment.username }}</div>
          <div class="text-muted small">
            {{ comment.createdAt | date:'medium' }}
          </div>
        </div>
        @if (isOwnComment) {
          <div class="btn-group">
            <button 
              class="btn btn-sm btn-outline-primary"
              (click)="onEdit()">
              Edit
            </button>
            <button 
              class="btn btn-sm btn-outline-danger"
              (click)="onDelete()">
              Delete
            </button>
          </div>
        }
      </div>
      <div class="mt-2">
        {{ comment.content }}
      </div>
    </div>
  `
})
export class CommentItemComponent {
  @Input() comment!: CommentDetail;
  @Output() deleted = new EventEmitter<number>();

  constructor(
    public authService: AuthService,
    private commentService: CommentService
  ) {}

  get isOwnComment(): boolean {
    return this.authService.currentUserValue?.user.id === this.comment.userId;
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(this.comment.id).subscribe({
        next: () => this.deleted.emit(this.comment.id),
        error: (error) => console.error('Error deleting comment:', error)
      });
    }
  }

  onEdit() {
    // TODO: Implement edit functionality
  }
}