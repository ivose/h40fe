import { headers } from './../utils/tokenHeaders';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Follow } from '../models/follow.model';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment.generated';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private apiUrl = `${environment.apiUrl}/follow`;

  constructor(private http: HttpClient) {}

  followUser(followeeId: number): Observable<Follow> {
    return this.http.post<Follow>(this.apiUrl, { followeeId }, { headers });
  }

  unfollowUser(followeeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${followeeId}`, { headers });
  }

  getFollowers(userId: number, pageable: PageableParams): Observable<PageResponse<User>> {
    return this.http.get<PageResponse<User>>(`${this.apiUrl}/followers/${userId}`, { params: { ...pageable } as any });//, { headers }
  }

  getFollowing(userId: number, pageable: PageableParams): Observable<PageResponse<User>> {
    return this.http.get<PageResponse<User>>(`${this.apiUrl}/following/${userId}`, { params: { ...pageable } as any });//, { headers }
  }
}