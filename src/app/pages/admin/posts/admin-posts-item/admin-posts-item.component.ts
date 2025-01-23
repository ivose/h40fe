// src/app/pages/admin/posts/admin-posts-item/admin-posts-item.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../../../models/post.model';

@Component({
  selector: '[app-admin-posts-item]', // Using attribute selector for tr
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-posts-item.component.html',
  styleUrls: ['./admin-posts-item.component.scss']
})
export class AdminPostsItemComponent {
  @Input() post!: Post;
  @Output() edit = new EventEmitter<Post>();
  @Output() delete = new EventEmitter<Post>();

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  truncateContent(content: string, maxLength: number = 100): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  }
}