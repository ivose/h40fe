import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLoginRequestDTO } from '../models/user-login-request-dto.model';
import { UserLoginResponseDTO } from '../models/user-login-response-dto.model';
import { SignupDto } from '../models/signup-dto.model';
import { UpdateProfileDTO } from '../models/user-profile-model.model';
import { PasswordChangeDto } from '../models/password-change-dto-model';
import { PasswordResetConfirmRequestDTO } from '../models/password-reset-conforim-request.model';
import { environment } from '../../environments/environment.generated';
import { Router } from '@angular/router';
import { headers } from '../utils/tokenHeaders';
import { PasswordForgotRequestDTO } from '../models/password-forgot-request.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public currentUserSubject: BehaviorSubject<UserLoginResponseDTO | null>; 
    public currentUser: Observable<UserLoginResponseDTO | null>;
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient, private router: Router) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<UserLoginResponseDTO | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): UserLoginResponseDTO | null {
        return this.currentUserSubject.value;
    }

    login(credentials: UserLoginRequestDTO): Observable<UserLoginResponseDTO> {
        this.logout();
        return this.http.post<UserLoginResponseDTO>(`${this.apiUrl}/login`, credentials)
            .pipe(map(response => {
                localStorage.clear();
                localStorage.setItem('currentUser', JSON.stringify(response));
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response);
                return response;
            }));
    }

    logout() {
        localStorage.clear(); 
        //localStorage.removeItem('currentUser');
        //localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    signup(userData: SignupDto): Observable<UpdateProfileDTO> {
        console.log(userData);
        return this.http.post<UpdateProfileDTO>(`${this.apiUrl}/signup`, userData);
    }

    updateProfile(profileData: UpdateProfileDTO): Observable<UpdateProfileDTO> {
        return this.http.put<UpdateProfileDTO>(`${this.apiUrl}/profile`, profileData, { headers });
    }

    changePassword(passwordData: PasswordChangeDto): Observable<any> {
        return this.http.put(`${this.apiUrl}/change-password`, passwordData, { headers });
    }

    forgotPassword(forgot: PasswordForgotRequestDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/forgot-password`, forgot);
    }

    resetPassword(resetData: PasswordResetConfirmRequestDTO): Observable<any> {
        return this.http.put(`${this.apiUrl}/reset-password`, resetData);
    }

    getMe(): Observable<UserLoginResponseDTO> {
        return this.http.get<UserLoginResponseDTO>(`${this.apiUrl}/me`, { headers });
    }
}