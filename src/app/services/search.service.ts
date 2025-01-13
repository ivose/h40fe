import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { environment } from '../../environments/environment.generated';
import { headers } from '../utils/tokenHeaders';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) {}

  searchUsers(query: string, pageable: PageableParams): Observable<PageResponse<User>> {
    return this.http.get<PageResponse<User>>(`${this.apiUrl}/users`, {
      params: { query, ...pageable as any }
    });//, { headers }
  }

  searchPosts(query: string, pageable: PageableParams): Observable<PageResponse<Post>> {
    return this.http.get<PageResponse<Post>>(`${this.apiUrl}/posts`, {
      params: { query, ...pageable as any }
    });//, { headers }
  }

  searchComments(query: string, pageable: PageableParams): Observable<PageResponse<Comment>> {
    return this.http.get<PageResponse<Comment>>(`${this.apiUrl}/comments`, {
      params: { query, ...pageable as any }
    });//, { headers }
  }
}