import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../models/pageable-params.model';
import { PageResponse } from '../models/page-response.model';
import { environment } from '../../environments/environment.generated';
import { createParams } from '../utils/paginParams';
import { headers } from '../utils/tokenHeaders';
import { User } from '../models/user2.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  
  constructor(private http: HttpClient) { }

  getAllUsers(pageable: PageableParams): Observable<PageResponse<User>> {
    return this.http.get<PageResponse<User>>(this.apiUrl, { headers, params: createParams(pageable) });  
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers });
  }
}