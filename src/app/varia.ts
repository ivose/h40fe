import { PageableParams } from "./models/pageable-params.model";
import { CommentReactionService } from "./services/comment-reaction.service";

export class CommentComponent {
  constructor(private commentReactionService: CommentReactionService) {}

  addLikeToComment(commentId: number, categoryId: number) {
    this.commentReactionService.addReaction(commentId, categoryId).subscribe({
      next: (reaction) => {
        console.log('Reaction added:', reaction);
        // Update UI
      },
      error: (error) => {
        console.error('Error adding reaction:', error);
        // Handle error
      }
    });
  }

  loadMyReactions() {
    const pageRequest = new PageableParams(0, 10);
    this.commentReactionService.getMyReactions(pageRequest).subscribe({
      next: (page) => {
        console.log('Reactions:', page.content);
        console.log('Total pages:', page.totalPages);
        // Update UI
      },
      error: (error) => {
        console.error('Error loading reactions:', error);
        // Handle error
      }
    });
  }

  updateReaction(reactionId: number, newCategoryId: number) {
    this.commentReactionService.updateReaction(reactionId, newCategoryId).subscribe({
      next: (updatedReaction) => {
        console.log('Reaction updated:', updatedReaction);
        // Update UI
      },
      error: (error) => {
        console.error('Error updating reaction:', error);
        // Handle error
      }
    });
  }

  removeReaction(reactionId: number) {
    this.commentReactionService.deleteReaction(reactionId).subscribe({
      next: () => {
        console.log('Reaction removed');
        // Update UI
      },
      error: (error) => {
        console.error('Error removing reaction:', error);
        // Handle error
      }
    });
  }
}