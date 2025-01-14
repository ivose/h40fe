import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';
import { AuthService } from '../../../services/auth.service';
import { CommentDetail } from '../../../models/comment-detail.model';

@Component({
  selector: 'app-comment-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (authService.currentUserValue) {
      <form (ngSubmit)="onSubmit()" class="mb-4">
        <div class="mb-3">
          <textarea
            class="form-control"
            rows="3"
            [(ngModel)]="content"
            name="content"
            placeholder="Write a comment..."
            required
          ></textarea>
        </div>
        <button 
          type="submit" 
          class="btn btn-primary"
          [disabled]="!content.trim() || submitting"
        >
          {{ submitting ? 'Posting...' : 'Post Comment' }}
        </button>
      </form>
    } @else {
      <div class="alert alert-info">
        Please <a routerLink="/login">login</a> to comment.
      </div>
    }
  `
})
export class CommentNewComponent {
  @Input() postId!: number;
  @Output() commentAdded = new EventEmitter<CommentDetail>();

  content = '';
  submitting = false;

  constructor(
    private commentService: CommentService,
    public authService: AuthService
  ) {}

  onSubmit() {
    if (!this.content.trim()) return;

    this.submitting = true;
    this.commentService.createComment({
      postId: this.postId,
      content: this.content.trim()
    }).subscribe({
      next: (comment) => {
        this.commentAdded.emit(comment);//Argument of type 'CommentDetail' is not assignable to parameter of type 'Comment'. Property 'postId' is missing in type 'CommentDetail' but required in type 'Comment'.ts(2345)
        this.content = '';
        this.submitting = false;
      },
      error: (error) => {
        console.error('Error posting comment:', error);
        this.submitting = false;
      }
    });
  }
}