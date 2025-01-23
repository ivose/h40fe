import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(): Observable<boolean> {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            this.router.navigate(['/login']);
            return of(false);
        }
        // Verify the current user's token is still valid
        return this.authService.getMe().pipe(
            map(() => true),
            catchError(() => {
                // Token is invalid or expired
                this.authService.logout();
                this.router.navigate(['/login']);
                return of(false);
            })
        );
    }
}