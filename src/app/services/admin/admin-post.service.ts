import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageResponse } from '../../models/page-response.model';
import { Post } from '../../models/post.model';
import { PageableParams } from '../../models/pageable-params.model';
import { environment } from '../../../environments/environment.generated';
import { headers } from '../../utils/tokenHeaders';

@Injectable({
  providedIn: 'root'
})
export class AdminPostService {
  private apiUrl = `${environment.apiUrl}/admin/posts`;

  constructor(private http: HttpClient) {}

  getAllPosts(search?: string, userId?: number, sortBy?: string, pageable: PageableParams = { page: 0, size: 10 }): Observable<PageResponse<Post>> {
    let params: any = { ...pageable };
    if (search) params.search = search;
    if (userId) params.userId = userId;
    if (sortBy) params.sortBy = sortBy;
    return this.http.get<PageResponse<Post>>(this.apiUrl, { params, headers });
  }

  getPostDetails(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${postId}`, { headers });
  }

  updatePost(postId: number, postData: { title: string; content: string }): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, postData, { headers });
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, { headers });
  }
}