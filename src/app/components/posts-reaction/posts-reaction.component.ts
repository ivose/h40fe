import { Component, Input, OnInit } from '@angular/core';
import { ReactionCategory } from '../../models/reaction-category.model';
import { Reaction } from '../../models/reaction.model';
import { ReactionService } from '../../services/reaction.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-posts-reaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts-reaction.component.html',
  styleUrl: './posts-reaction.component.scss'
})
export class PostsReactionComponent implements OnInit {
  @Input() postId!: number;

  reactionCategories: ReactionCategory[] = [];
  reactions: { categoryId: number; count: number }[] = [];
  currentUserReaction?: Reaction;
  loading = true;

  constructor(
    private reactionService: ReactionService,
    private postService: PostService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.reactionService.getReactionCategories().subscribe({
      next: (categories) => {
        this.reactionCategories = categories;
        this.loadReactions();
      },
      error: (error) => {
        console.error('Error loading reaction categories:', error);
        this.loading = false;
      }
    });
  }

  loadReactions() {
    this.postService.getPostDetails(this.postId).subscribe({
      next: (post) => {
        this.reactions = post.reactions;
        this.reactionService.getMyReaction(this.postId).subscribe({
          next: (reaction) => {
            this.currentUserReaction = reaction || undefined;
          },
          error: (error) => console.error('Error loading user reaction:', error)
        });
      },
      error: (error) => console.error('Error loading reactions:', error)
    });
  }

  isSelected(categoryId: number): boolean {
    return this.currentUserReaction?.category.id === categoryId;
  }

  getReactionCount(categoryId: number): number {
    const reaction = this.reactions.find(r => r.categoryId === categoryId);
    return reaction?.count || 0;
  }

  toggleReaction(categoryId: number) {
    if (!this.authService.currentUserValue) return;

    if (this.currentUserReaction) {
      if (this.currentUserReaction.category.id === categoryId) {
        // Delete reaction
        this.reactionService.deletePostReaction(this.currentUserReaction.id).subscribe({
          next: () => this.loadReactions(),
          error: (error) => console.error('Error deleting reaction:', error)
        });
      } else {
        // Update reaction
        this.reactionService.updatePostReaction(this.currentUserReaction.id, categoryId).subscribe({
          next: () => this.loadReactions(),
          error: (error) => console.error('Error updating reaction:', error)
        });
      }
    } else {
      // Create new reaction
      this.reactionService.addPostReaction(this.postId, categoryId).subscribe({
        next: () => this.loadReactions(),
        error: (error) => console.error('Error adding reaction:', error)
      });
    }
  }
}
