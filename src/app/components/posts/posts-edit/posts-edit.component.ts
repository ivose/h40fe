// components/posts/edit/posts-edit.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'post-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts-edit.component.html',
  styleUrls: ['./posts-edit.component.scss']
})
export class PostsEditComponent implements OnInit {
  postId!: number;
  title = '';
  content = '';
  loading = true;
  saving = false;
  error = '';

  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.postId = +params['id'];
      this.loadPost();
    });
  }

  loadPost() {
    this.loading = true;
    this.error = '';

    this.postService.getPostDetails(this.postId).subscribe({
      next: (post) => {
        // Verify ownership
        if (post.userId !== this.authService.currentUserValue?.user.id) {
          this.error = "You don't have permission to edit this post";
          return;
        }

        this.title = post.title;
        this.content = post.content;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error loading post';
        this.loading = false;
      }
    });
  }

  isValid(): boolean {
    return Boolean(this.title.trim()) && Boolean(this.content.trim());
  }

  onSubmit() {
    if (this.isValid() && !this.saving) {
      this.saving = true;
      this.error = '';

      this.postService.updatePost(this.postId, {
        title: this.title.trim(),
        content: this.content.trim()
      }).subscribe({
        next: () => {
          this.router.navigate(['/posts', this.postId]);
        },
        error: (error) => {
          this.error = error.error?.message || 'Error updating post';
          this.saving = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/posts', this.postId]);
  }
}