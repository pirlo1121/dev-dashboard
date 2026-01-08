import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { IProject, IProjectResponse } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  projects = signal<IProject[]>([]);

  ngOnInit() {
    this.loadProjects();
    setTimeout(() => console.log(this.projects()), 2000);
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data: IProjectResponse) => this.projects.set(data.projects),
      error: (err) => console.error(err)
    });
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => this.loadProjects(),
        error: (err) => alert('Failed to delete')
      });
    }
  }
}
