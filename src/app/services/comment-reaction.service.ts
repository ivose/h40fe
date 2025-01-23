// src/app/services/comment-reaction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.generated';
import { headers } from '../utils/tokenHeaders';
import { ReactionCategory } from '../models/reaction-category.model';
import { CommentReaction } from '../models/comment-reaction.model';

@Injectable({
  providedIn: 'root'
})
export class CommentReactionService {
  private apiUrl = `${environment.apiUrl}/commentreactions`;

  constructor(private http: HttpClient) { }

  getMyReaction(commentId: number): Observable<CommentReaction | null> {
    return this.http.get<CommentReaction | null>(`${this.apiUrl}/mine/${commentId}`, { headers });
  }

  getReactionCategories(): Observable<ReactionCategory[]> {
    return this.http.get<ReactionCategory[]>(`${this.apiUrl}/categories`, { headers });
  }

  readCommentReaction(reactionId: number): Observable<CommentReaction> {
    return this.http.get<CommentReaction>(`${this.apiUrl}/${reactionId}`, { headers });
  }

  addCommentReaction(commentId: number, categoryId: number): Observable<CommentReaction> {
    return this.http.post<CommentReaction>(this.apiUrl, { commentId, categoryId }, { headers });
  }

  updateCommentReaction(reactionId: number, categoryId: number): Observable<CommentReaction> {
    return this.http.put<CommentReaction>(`${this.apiUrl}/${reactionId}/${categoryId}`, {}, { headers });
  }

  deleteCommentReaction(reactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${reactionId}`, { headers });
  }
}