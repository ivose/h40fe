import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { Post } from '../models/post.model';
import { environment } from '../../environments/environment.generated';
import { headers } from '../utils/tokenHeaders';
import { createParams } from '../utils/paginParams';
import { PostDetails } from '../models/post-details.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;


  constructor(private http: HttpClient) {}

  getAllPosts(pageable: PageableParams): Observable<PageResponse<Post>> {
    return this.http.get<PageResponse<Post>>(this.apiUrl, { headers, params: createParams(pageable) });
  }

  getPostDetails(postId: number): Observable<PostDetails> {
    return this.http.get<PostDetails>(`${this.apiUrl}/${postId}`, { headers });
  }

  createPost(postData: { title: string; content: string }): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, postData, { headers });
  }

  updatePost(postId: number, postData: { title: string; content: string }): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${postId}`, postData, { headers });
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${postId}`, { headers });
  }

  getUserFeed(pageable: PageableParams): Observable<PageResponse<Post>> {
    return this.http.get<PageResponse<Post>>(`${this.apiUrl}/feed`, { headers, params: createParams(pageable) });
  }

  getMyPosts(pageable: PageableParams): Observable<PageResponse<Post>> {
    return this.http.get<PageResponse<Post>>(`${this.apiUrl}/my`, { headers, params: createParams(pageable) });
  }
 
  getUserPosts(pageable: PageableParams, userId: number): Observable<PageResponse<Post>> {
    return this.http.get<PageResponse<Post>>(`${this.apiUrl}/user/${userId}`, { headers, params: createParams(pageable) });
  }
}
