import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../../models/pageable-params.model';
import { PageResponse } from '../../models/page-response.model';
import { environment } from '../../../environments/environment.generated';

@Injectable({
  providedIn: 'root'
})
export class AdminCommentService {
  private apiUrl = `${environment.apiUrl}/admin/comments`;


  constructor(private http: HttpClient) {}

  getAllComments(search?: string, userId?: number, pageable: PageableParams = { page: 0, size: 10 }): Observable<PageResponse<Comment>> {
    let params: any = { ...pageable };
    if (search) params.search = search;
    if (userId) params.userId = userId;
    return this.http.get<PageResponse<Comment>>(this.apiUrl, { params });
  }

  getComment(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.apiUrl}/${commentId}`);
  }

  updateComment(commentId: number, content: string): Observable<Comment> {
    return this.http.put<Comment>(`${this.apiUrl}/${commentId}`, { content });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`);
  }
}