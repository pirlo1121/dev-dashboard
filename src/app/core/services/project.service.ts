import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { IProject, IProjectResponse, IProjectsResponse } from '../models/project.model';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/projects';

    getProjects(): Observable<IProjectsResponse> {
        return this.http.get<IProjectsResponse>(this.apiUrl);
    }

    getProject(id: string): Observable<IProjectResponse> { // corregir
        return this.http.get<IProjectResponse>(`${this.apiUrl}/${id}`);
    }

    createProject(formData: FormData): Observable<IProject> {
        return this.http.post<IProject>(this.apiUrl, formData, { withCredentials: true });
    }

    updateProject(id: string, data: Partial<IProject>): Observable<IProject> {
        return this.http.patch<IProject>(`${this.apiUrl}/${id}`, data, { withCredentials: true });
    }

    deleteProject(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
    }
}
