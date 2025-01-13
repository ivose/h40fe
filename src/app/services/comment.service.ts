import { headers } from './../utils/tokenHeaders';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../environments/environment.generated';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;
  

  constructor(private http: HttpClient) {}

  getUserComments(pageable: PageableParams): Observable<PageResponse<Comment>> {
    return this.http.get<PageResponse<Comment>>(this.apiUrl, { params: { ...pageable } as any });
  }

  createComment(commentData: { postId: number; parentCommentId?: number; content: string }): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, commentData, { headers });
  }

  updateComment(commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, { content }, { headers });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`, { headers });
  }

  getCommentWithReplies(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${commentId}`);
  }
}