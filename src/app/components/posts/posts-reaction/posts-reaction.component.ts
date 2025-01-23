import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactionCategory } from '../../../models/reaction-category.model';
import { ReactionService } from '../../../services/reaction.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactionStateService } from '../../../services/reaction-state.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-posts-reaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './posts-reaction.component.html',
  styleUrls: ['./posts-reaction.component.scss']
})
export class PostsReactionComponent implements OnInit, OnDestroy {
  @Input() postId!: number;

  reactionCategories: ReactionCategory[] = [];
  reactionCounts: { catId: number, count: number }[] = [];
  myReactionCatId: number = 0;
  private previousReactionCatId: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private reactionService: ReactionService,
    public authService: AuthService,
    private reactionStateService: ReactionStateService
  ) { }

  ngOnInit() {
    this.reactionStateService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.reactionCategories = categories;
        },
        error: (error) => {
          console.error('Error loading reaction categories:', error);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @Input() set reactions(value: any) {
    if (value) {
      this.reactionCounts = value.counts || [];
      this.myReactionCatId = value.myReactionCatId || 0;
      this.previousReactionCatId = this.myReactionCatId;
    } else {
      this.reactionCounts = [];
      this.myReactionCatId = 0;
      this.previousReactionCatId = 0;
    }
  }

  getReactionCount(categoryId: number): number {
    const reaction = this.reactionCounts.find(r => r.catId === categoryId);
    return reaction?.count || 0;
  }

  private updateLocalCounts(oldCategoryId: number, newCategoryId: number) {
    // Remove count from old category if exists
    if (oldCategoryId !== 0) {
      const oldIndex = this.reactionCounts.findIndex(r => r.catId === oldCategoryId);
      if (oldIndex !== -1) {
        if (this.reactionCounts[oldIndex].count > 1) {
          this.reactionCounts[oldIndex].count--;
        } else {
          this.reactionCounts.splice(oldIndex, 1);
        }
      }
    }

    // Add count to new category if not removing reaction
    if (newCategoryId !== 0) {
      const newIndex = this.reactionCounts.findIndex(r => r.catId === newCategoryId);
      if (newIndex !== -1) {
        this.reactionCounts[newIndex].count++;
      } else {
        this.reactionCounts.push({ catId: newCategoryId, count: 1 });
      }
    }
  }

  toggleReaction(categoryId: number) {
    if (!this.authService.currentUserValue) return;

    const oldCategoryId = this.myReactionCatId;
    const newCategoryId = oldCategoryId === categoryId ? 0 : categoryId;

    // Optimistically update UI
    this.updateLocalCounts(oldCategoryId, newCategoryId);
    this.myReactionCatId = newCategoryId;

    if (oldCategoryId === categoryId) {
      // Remove reaction
      this.reactionService.getMyReaction(this.postId).subscribe({
        next: reaction => {
          if (reaction) {
            this.reactionService.deletePostReaction(reaction.id).subscribe({
              error: () => {
                // Revert on error
                this.updateLocalCounts(newCategoryId, oldCategoryId);
                this.myReactionCatId = oldCategoryId;
              }
            });
          }
        },
        error: () => {
          // Revert on error
          this.updateLocalCounts(newCategoryId, oldCategoryId);
          this.myReactionCatId = oldCategoryId;
        }
      });
    } else if (oldCategoryId !== 0) {
      // Update existing reaction
      this.reactionService.getMyReaction(this.postId).subscribe({
        next: reaction => {
          if (reaction) {
            this.reactionService.updatePostReaction(reaction.id, categoryId).subscribe({
              error: () => {
                // Revert on error
                this.updateLocalCounts(newCategoryId, oldCategoryId);
                this.myReactionCatId = oldCategoryId;
              }
            });
          }
        },
        error: () => {
          // Revert on error
          this.updateLocalCounts(newCategoryId, oldCategoryId);
          this.myReactionCatId = oldCategoryId;
        }
      });
    } else {
      // Add new reaction
      this.reactionService.addPostReaction(this.postId, categoryId).subscribe({
        error: () => {
          // Revert on error
          this.updateLocalCounts(newCategoryId, oldCategoryId);
          this.myReactionCatId = oldCategoryId;
        }
      });
    }
  }
}