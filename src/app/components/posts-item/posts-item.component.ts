// posts-item.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { Post } from '../../models/post.model';
import { PostDetails } from '../../models/post-details.model';
import { AuthService } from '../../services/auth.service';
import { PostService } from '../../services/post.service';
import { PostsReactionComponent } from '../posts-reaction/posts-reaction.component';

@Component({
  selector: 'post-item',
  standalone: true,
  imports: [CommonModule, RouterLink, PostsReactionComponent],
  templateUrl: './posts-item.component.html',
  styleUrls: ['./posts-item.component.scss']
})
export class PostsItemComponent implements OnInit {
  @Input() post!: Post;
  @Input() isDetailView = false;
  @Output() deleted = new EventEmitter<void>();
  
  expanded = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (this.isDetailView) {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loadPost(+id);
      }
    }
  }

  loadPost(id: number) {
    this.postService.getPostDetails(id).subscribe({
      next: (postDetails) => {
        // Convert PostDetails to Post
        this.post = new Post(
          postDetails.id,
          postDetails.userId,
          postDetails.username,
          postDetails.title,
          postDetails.content,
          new Date(postDetails.createdAt),
          new Date(postDetails.updatedAt),
          postDetails.commentsCount,
          postDetails.reactionsCount
        );
      },
      error: (error) => this.error = error.error?.message || 'Error loading post'
    });
  }

  get isOwnPost(): boolean {
    return this.authService.currentUserValue?.user.id === this.post.userId;
  }

  viewComments() {
    this.router.navigate(['/posts', this.post.id]);
  }

  editPost() {
    this.router.navigate(['/posts', this.post.id, 'edit']);
  }

  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      this.postService.deletePost(this.post.id).subscribe({
        next: () => {
          if (this.isDetailView) {
            this.router.navigate(['/posts']);
          } else {
            this.deleted.emit();
          }
        },
        error: (error) => {
          this.error = error.error?.message || 'Error deleting post';
          setTimeout(() => this.error = '', 5000);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/posts']);
  }
}