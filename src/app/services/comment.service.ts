import { headers } from './../utils/tokenHeaders';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../environments/environment.generated';
import { CommentDetail } from '../models/comment-detail.model';
import { createParams } from '../utils/paginParams';
import { CommentCreate } from '../models/comment-create.model';
import { CommentUpdate } from '../models/comment-update.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = `${environment.apiUrl}/comments`;


  constructor(private http: HttpClient) { }

  getUserComments(pageable: PageableParams): Observable<PageResponse<CommentDetail>> {
    return this.http.get<PageResponse<CommentDetail>>(this.apiUrl, { headers, params: createParams(pageable) });
  }

  // Create a new comment
  createComment(commentData: CommentCreate): Observable<CommentDetail> {
    return this.http.post<CommentDetail>(this.apiUrl, commentData, { headers });
  }

  updateComment(commentId: number, data: CommentUpdate): Observable<CommentDetail> {
    return this.http.put<CommentDetail>(`${this.apiUrl}/${commentId}`, data, { headers });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`, { headers });
  }

  getCommentWithReplies(commentId: number): Observable<CommentDetail> {
    return this.http.get<CommentDetail>(`${this.apiUrl}/${commentId}`, { headers });
  }

  getPostComments(postId: number, pageable?: PageableParams): Observable<PageResponse<CommentDetail>> {
    const params = pageable ? createParams(pageable) : {};
    return this.http.get<PageResponse<CommentDetail>>(`${this.apiUrl}/post/${postId}`, { headers, params });
  }

}