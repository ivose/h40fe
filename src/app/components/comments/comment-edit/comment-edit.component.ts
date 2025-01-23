// src/app/components/comments/comment-edit/comment-edit.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';
import { CommentDetail } from '../../../models/comment-detail.model';

@Component({
  selector: 'app-comment-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-edit.component.html',
})
export class CommentEditComponent {
  @Input() comment!: CommentDetail;
  @Output() edited = new EventEmitter<CommentDetail>();
  @Output() cancelled = new EventEmitter<void>();

  content = '';
  saving = false;
  error = '';

  ngOnInit() {
    this.content = this.comment.content;
  }

  constructor(private commentService: CommentService) { }

  isValid(): boolean {
    return Boolean(this.content.trim());
  }

  onSubmit() {
    if (!this.isValid() || this.saving) return;

    this.saving = true;
    this.commentService.updateComment(this.comment.id, { content: this.content.trim() })
      .subscribe({
        next: (updatedComment) => {
          this.edited.emit(updatedComment);
          this.saving = false;
        },
        error: (error) => {
          this.error = error.error?.message || 'Error updating comment';
          this.saving = false;
          console.error('Error updating comment:', error);
        }
      });
  }

  onCancel() {
    this.cancelled.emit();
  }
}