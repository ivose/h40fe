import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { CommentService } from '../../../services/comment.service';
import { CommentDetail } from '../../../models/comment-detail.model';
import { CommentEditComponent } from '../comment-edit/comment-edit.component';
import { CommentReactionComponent } from '../comment-reaction/comment-reaction.component';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule, CommentEditComponent, CommentReactionComponent],
  templateUrl: './comment-item.component.html',
})
export class CommentItemComponent {
  @Input() comment!: CommentDetail;
  @Output() deleted = new EventEmitter<number>();
  @Output() updated = new EventEmitter<CommentDetail>();

  isEditing = false;

  constructor(
    public authService: AuthService,
    private commentService: CommentService
  ) { }

  get isOwnComment(): boolean {
    return this.authService.currentUserValue?.user.id === this.comment.userId;
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
  }

  onEdited(updatedComment: CommentDetail) {
    this.comment = updatedComment;
    this.isEditing = false;
    this.updated.emit(updatedComment);
  }

  onDelete() {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(this.comment.id).subscribe({
        next: () => this.deleted.emit(this.comment.id),
        error: (error) => console.error('Error deleting comment:', error)
      });
    }
  }
}