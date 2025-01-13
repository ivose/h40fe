import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../../models/pageable-params.model';
import { PageResponse } from '../../models/page-response.model';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment.generated';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(search?: string, active?: boolean, pageable: PageableParams = { page: 0, size: 10 }): Observable<PageResponse<User>> {
    let params: any = { ...pageable };
    if (search) params.search = search;
    if (active !== undefined) params.active = active;
    return this.http.get<PageResponse<User>>(this.apiUrl, { params });
  }

  createUser(userData: {
    email: string;
    username: string;
    password: string;
    fullname: string;
    born: string;
  }): Observable<User> {
    return this.http.post<User>(this.apiUrl, userData);
  }

  getUserDetails(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  updateUser(userId: number, userData: {
    email?: string;
    fullname?: string;
    born?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  updateUserStatus(userId: number, active: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/status`, null, {
      params: { active: active.toString() }
    });
  }

  updateUserAdmin(userId: number, isAdmin: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/admin`, null, {
      params: { isAdmin: isAdmin.toString() }
    });
  }
}