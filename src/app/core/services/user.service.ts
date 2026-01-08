import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api';

    getUser(id: string): Observable<IUser> {
        return this.http.get<IUser>(`${this.apiUrl}/get/${id}`, { withCredentials: true });
    }

    updateUser(id: string, data: Partial<IUser>): Observable<IUser> {
        return this.http.put<IUser>(`${this.apiUrl}/update/${id}`, data, { withCredentials: true });
    }

    sendContact(data: { name: string; email: string; message: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/contact`, data);
    }
}
