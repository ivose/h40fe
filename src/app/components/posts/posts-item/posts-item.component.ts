// posts-item.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule, ActivatedRoute } from '@angular/router';
import { Post } from '../../../models/post.model';
import { PostDetails } from '../../../models/post-details.model';
import { AuthService } from '../../../services/auth.service';
import { PostService } from '../../../services/post.service';
import { PostsReactionComponent } from '../posts-reaction/posts-reaction.component';
import { CommentListComponent } from '../../comments/comment-list/comment-list.component';

@Component({
  selector: 'post-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PostsReactionComponent,
    CommentListComponent
  ],
  templateUrl: './posts-item.component.html',
  styleUrls: ['./posts-item.component.scss']
})
export class PostsItemComponent implements OnInit {
  @Input() post?: Post;
  @Input() isDetailView = false;
  @Output() deleted = new EventEmitter<void>();

  expanded = false;
  error = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    // Check route data for isDetailView
    this.route.data.subscribe(data => {
      this.isDetailView = data['isDetailView'] || false;
    });

    // Load post if in detail view
    if (this.isDetailView) {
      const id = this.route.paramMap.subscribe(params => {
        const postId = params.get('id');
        if (postId) {
          this.loadPost(+postId);
        }
      });
    } else {
      this.loading = false;
    }
  }

  loadPost(id: number) {
    this.loading = true;
    this.error = '';
    
    this.postService.getPostDetails(id).subscribe({
      next: (postDetails) => {
        this.post = {
          id: postDetails.id,
          userId: postDetails.userId,
          username: postDetails.username,
          title: postDetails.title,
          content: postDetails.content,
          createdAt: new Date(postDetails.createdAt),
          updatedAt: new Date(postDetails.updatedAt),
          commentsCount: postDetails.commentsCount,
          reactionsCount: postDetails.reactionsCount
        };
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'Error loading post';
        this.loading = false;
      }
    });
  }

  get isOwnPost(): boolean {
    return this.authService.currentUserValue?.user.id === this.post?.userId;
  }

  viewComments() {
    if (this.post) {
      this.router.navigate(['/posts', this.post.id]);
    }
  }

  editPost() {
    if (this.post) {
      this.router.navigate(['/posts', this.post.id, 'edit']);
    }
  }

  deletePost() {
    if (confirm('Are you sure you want to delete this post?')) {
      if (this.post) {
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
  }

  goBack() {
    this.router.navigate(['/posts']);
  }
}