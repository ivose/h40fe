// src/app/pages/admin/comments/admin-comments-item.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../../models/comment.model';

@Component({
  selector: '[app-admin-comments-item]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-comments-item.component.html',
  styleUrls: ['./admin-comments-item.component.scss']
})
export class AdminCommentsItemComponent {
  @Input() comment!: Comment;
  @Output() edit = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<Comment>();

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}