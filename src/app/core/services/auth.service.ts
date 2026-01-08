import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/auth';

    // Signal to track login state
    isLoggedIn = signal<boolean>(false);

    constructor() {
        // Optionally check auth on startup if needed (e.g. check cookie existence via a lightweight call or just assume false until proven otherwise)
        // For now, we rely on the components calling checkAuth or login.
    }

    checkAuth(): Observable<string> {
        return this.http.get(this.apiUrl, { responseType: 'text', withCredentials: true }).pipe(
            tap({
                next: () => this.isLoggedIn.set(true),
                error: () => this.isLoggedIn.set(false)
            })
        );
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
            tap(() => this.isLoggedIn.set(true))
        );
    }

    logout(): Observable<any> {
        return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
            tap(() => this.isLoggedIn.set(false))
        );
    }
}
