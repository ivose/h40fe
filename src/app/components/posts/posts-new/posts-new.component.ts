// components/posts/new/posts-new.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../../../services/post.service';

@Component({
  selector: 'app-posts-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts-new.component.html',
  styleUrls: ['./posts-new.component.scss']
})
export class PostsNewComponent {
  title = '';
  content = '';

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  isValid(): boolean {
    return Boolean(this.title.trim()) && Boolean(this.content.trim());
  }

  onSubmit() {
    if (this.isValid()) {
      this.postService.createPost({
        title: this.title.trim(),
        content: this.content.trim()
      }).subscribe({
        next: () => this.router.navigate(['/my-posts']),
        error: (error) => console.error('Error creating post:', error)
      });
    }
  }

  cancel() {
    this.router.navigate(['/my-posts']);
  }
}