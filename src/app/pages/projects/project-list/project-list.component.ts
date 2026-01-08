import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { IProject, IProjectResponse } from '../../../core/models/project.model';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="page-header">
      <div>
        <h1 class="page-title">Projects</h1>
        <p class="page-subtitle">Manage your portfolio projects</p>
      </div>
      <a routerLink="/dashboard/projects/new" class="btn btn-primary">
        + New Project
      </a>
    </header>
    
    <div class="projects-grid">
      @for (project of projects(); track project._id) {
        <div class="glass-card project-card">
          <div class="card-image" [style.background-image]="'url(' + project.image + ')'"></div>
          <div class="card-content">
            <h3 class="card-title">{{ project.name }}</h3>
            <p class="card-desc">{{ project.description }}</p>
            
            <div class="tech-stack">
              @for (tech of project.stack; track tech) {
                <span class="badge">{{ tech }}</span>
              }
            </div>

            <div class="card-actions">
              <a [routerLink]="['/dashboard/projects/edit', project._id]" class="btn-text">Edit</a>
              <button (click)="deleteProject(project._id!)" class="btn-text text-error">Delete</button>
            </div>
          </div>
        </div>
      } @empty {
        <div class="empty-state">
            <p>No projects found. Create your first one!</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .page-subtitle {
      color: var(--text-muted);
    }
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .project-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s;
    }
    .project-card:hover {
      transform: translateY(-5px);
    }
    .card-image {
      height: 180px;
      background-size: cover;
      background-position: center;
      background-color: #1e293b;
    }
    .card-content {
      padding: 1.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .card-title {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: var(--text-main);
    }
    .card-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1rem;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .tech-stack {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.75rem;
      background: rgba(139, 92, 246, 0.1);
      color: var(--primary);
      border-radius: 999px;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }
    .card-actions {
      border-top: 1px solid var(--border-color);
      padding-top: 1rem;
      display: flex;
      justify-content: space-between;
    }
    .btn-text {
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      transition: color 0.2s;
      text-decoration: none;
    }
    .btn-text:hover {
      color: var(--text-main);
    }
    .text-error:hover {
      color: var(--error);
    }
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem;
        color: var(--text-muted);
    }
  `]
})
export class ProjectListComponent implements OnInit {
  private projectService = inject(ProjectService);
  projects = signal<IProject[]>([]);

  ngOnInit() {
    this.loadProjects();
    console.log(this.projects());
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
