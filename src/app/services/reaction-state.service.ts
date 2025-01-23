import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ReactionCategory } from '../models/reaction-category.model';
import { ReactionService } from './reaction.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionStateService {
  private categories$: Observable<ReactionCategory[]> | null = null;

  constructor(private reactionService: ReactionService) {}

  getCategories(): Observable<ReactionCategory[]> {
    if (!this.categories$) {
      this.categories$ = this.reactionService.getReactionCategories().pipe(
        shareReplay(1)
      );
    }
    return this.categories$;
  }

  clearCache(): void {
    this.categories$ = null;
  }
}