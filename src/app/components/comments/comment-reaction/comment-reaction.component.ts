import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactionCategory } from '../../../models/reaction-category.model';
import { CommentReactionService } from '../../../services/comment-reaction.service';
import { AuthService } from '../../../services/auth.service';
import { ReactionStateService } from '../../../services/reaction-state.service';
import { Subject, takeUntil } from 'rxjs';
import { ReactionStats } from '../../../models/reaction-stats.model';

@Component({
  selector: 'app-comment-reaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-reaction.component.html',
  styleUrls: ['./comment-reaction.component.scss']
})
export class CommentReactionComponent implements OnInit, OnDestroy {
  @Input() commentId!: number;

  reactionCategories: ReactionCategory[] = [];
  reactionCounts: { catId: number, count: number }[] = [];
  myReactionCatId: number = 0;
  private previousReactionCatId: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private reactionService: CommentReactionService,
    public authService: AuthService,
    private reactionStateService: ReactionStateService
  ) {}

  ngOnInit() {
    this.reactionStateService.getCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (categories) => {
          this.reactionCategories = categories;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @Input() set reactions(value: ReactionStats | null) {
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

    // Call API and handle errors
    if (oldCategoryId === categoryId) {
      this.reactionService.getMyReaction(this.commentId).subscribe({
        next: reaction => {
          if (reaction) {
            this.reactionService.deleteCommentReaction(reaction.id).subscribe({
              error: () => this.revertChanges(newCategoryId, oldCategoryId)
            });
          }
        },
        error: () => this.revertChanges(newCategoryId, oldCategoryId)
      });
    } else if (oldCategoryId !== 0) {
      this.reactionService.getMyReaction(this.commentId).subscribe({
        next: reaction => {
          if (reaction) {
            this.reactionService.updateCommentReaction(reaction.id, categoryId).subscribe({
              error: () => this.revertChanges(newCategoryId, oldCategoryId)
            });
          }
        },
        error: () => this.revertChanges(newCategoryId, oldCategoryId)
      });
    } else {
      this.reactionService.addCommentReaction(this.commentId, categoryId).subscribe({
        error: () => this.revertChanges(newCategoryId, oldCategoryId)
      });
    }
  }

  private revertChanges(newCategoryId: number, oldCategoryId: number) {
    this.updateLocalCounts(newCategoryId, oldCategoryId);
    this.myReactionCatId = oldCategoryId;
  }
}