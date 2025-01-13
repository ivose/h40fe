import { headers } from './../utils/tokenHeaders';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { CommentReaction } from '../models/comment-reaction.model';
import { environment } from '../../environments/environment.generated';

@Injectable({
  providedIn: 'root'  // This makes the service available throughout the app
})
export class CommentReactionService {
  // Base URL for all comment reaction endpoints
  private apiUrl = `${environment.apiUrl}/commentreactions`;

  constructor(private http: HttpClient) {}

  // Get all reactions made by the currently logged-in user
  // Uses pagination with PageableParams (page, size, sort)
  getMyReactions(pageable: PageableParams): Observable<PageResponse<CommentReaction>> {
    return this.http.get<PageResponse<CommentReaction>>(this.apiUrl, {
      params: { ...pageable as any }
    });//, { headers }??
  }

  // Add a new reaction to a comment
  // Parameters:
  // - commentId: The ID of the comment to react to
  // - categoryId: The ID of the reaction category (like, love, etc.)
  addReaction(commentId: number, categoryId: number): Observable<CommentReaction> {
    return this.http.post<CommentReaction>(this.apiUrl, { 
      commentId, 
      categoryId 
    }, { headers });
  }

  // Get details of a specific reaction by its ID
  getReaction(reactionId: number): Observable<CommentReaction> {
    return this.http.get<CommentReaction>(`${this.apiUrl}/${reactionId}`, { headers });
  }

  // Update an existing reaction to a different category
  // Example: Change a 'like' to a 'love'
  updateReaction(reactionId: number, categoryId: number): Observable<CommentReaction> {
    return this.http.put<CommentReaction>(
      `${this.apiUrl}/${reactionId}/${categoryId}`, 
      {},
      { headers }
    );
  }

  // Remove a reaction from a comment
  deleteReaction(reactionId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reactionId}`, { headers });
  }
}