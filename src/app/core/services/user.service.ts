import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserResponse } from '../models/user.model';
import { environment } from '../../../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl;

    getUser(id: string): Observable<IUserResponse> {
        return this.http.get<IUserResponse>(`${this.apiUrl}/get/${id}`, { withCredentials: true });
    }

    updateUser(id: string, data: Partial<IUser>): Observable<IUser> {
        return this.http.put<IUser>(`${this.apiUrl}/update/${id}`, data, { withCredentials: true });
    }

    sendContact(data: { name: string; email: string; message: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/contact`, data);
    }
    updateUserImage(id: string, file: File): Observable<{ image: string }> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.patch<{ image: string }>(`${this.apiUrl}/update-image/${id}`, formData, { withCredentials: true });
    }
}
