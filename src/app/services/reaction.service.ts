import { headers } from './../utils/tokenHeaders';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaction } from '../models/reaction.model';
import { CommentReaction } from '../models/comment-reaction.model';
import { environment } from '../../environments/environment.generated';
import { ReactionCategory } from '../models/reaction-category.model';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  private apiUrl = `${environment.apiUrl}/reactions`;

  constructor(private http: HttpClient) { }

  getMyReaction(postId: number): Observable<Reaction | null> {
    return this.http.get<Reaction | null>(`${this.apiUrl}/mine/${postId}`, { headers });
  }

  getReactionCategories(): Observable<ReactionCategory[]> {
    return this.http.get<ReactionCategory[]>(`${this.apiUrl}/categories`, { headers });
  }

  readPostReaction(reactionId: number): Observable<Reaction> {
    return this.http.get<Reaction>(`${this.apiUrl}/${reactionId}`, { headers });
  }

  addPostReaction(postId: number, categoryId: number): Observable<Reaction> {
    return this.http.post<Reaction>(`${this.apiUrl}`, { postId, categoryId }, { headers });
  }

  updatePostReaction(reactionId: number, categoryId: number): Observable<Reaction> {
    return this.http.put<Reaction>(`${this.apiUrl}/${reactionId}/${categoryId}`, {}, { headers });
  }

  deletePostReaction(reactionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reactionId}`, { headers });
  }
}