import { headers } from './../../utils/tokenHeaders';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageableParams } from '../../models/pageable-params.model';
import { PageResponse } from '../../models/page-response.model';
import { User } from '../../models/user.model';
import { environment } from '../../../environments/environment.generated';
import { UserAdmC } from '../../models/user-adm-c.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  getAllUsers(search?: string, active?: boolean, pageable: PageableParams = { page: 0, size: 10 }): Observable<PageResponse<User>> {
    let params: any = { ...pageable };
    if (search) params.search = search;
    if (active !== undefined) params.active = active;
    return this.http.get<PageResponse<User>>(this.apiUrl, { params, headers });
  }

  createUser(userData: any): Observable<User> {
    const requestData = {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      fullname: userData.fullName || userData.fullname,
      born: userData.born
    };
    return this.http.post<User>(this.apiUrl, requestData, { headers });
  }

  getUserDetails(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers });
  }

  updateUser(userId: number, userData: {
    email?: string;
    fullName?: string;
    born?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, userData, { headers });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers });
  }

  updateUserStatus(userId: number, active: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/status`, null, {
      params: { active: active.toString() }, headers
    });
  }

  updateUserAdmin(userId: number, isAdmin: boolean): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}/admin`, null, {
      params: { isAdmin: isAdmin.toString() }, headers
    });
  }
}