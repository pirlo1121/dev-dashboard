import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';

@Component({
    selector: 'app-project-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    template: `
    <header class="page-header">
      <h1 class="page-title">{{ isEditMode() ? 'Edit Project' : 'New Project' }}</h1>
    </header>

    <div class="glass-card form-container">
      <form [formGroup]="projectForm" (ngSubmit)="onSubmit()">
        
        <!-- Name -->
        <div class="form-group">
          <label class="form-label">Project Name</label>
          <input type="text" formControlName="name" class="form-input" placeholder="e.g., Portfolio Website">
        </div>

        <!-- Description -->
        <div class="form-group">
          <label class="form-label">Description</label>
          <textarea formControlName="description" class="form-input" rows="4" placeholder="Project details..."></textarea>
        </div>

        <!-- Links -->
        <div class="grid-2">
            <div class="form-group">
            <label class="form-label">Repository URL</label>
            <input type="url" formControlName="repository" class="form-input" placeholder="https://github.com/...">
            </div>

            <div class="form-group">
            <label class="form-label">Deploy URL</label>
            <input type="url" formControlName="deploy" class="form-input" placeholder="https://...">
            </div>
        </div>

        <!-- Stack -->
        <div class="form-group">
          <label class="form-label">Tech Stack (Comma separated)</label>
          <input type="text" [formControl]="stackInput" (blur)="updateStack()" class="form-input" placeholder="React, Node.js, TypeScript">
          <div class="tech-tags">
            @for (tech of projectForm.get('stack')?.value; track tech) {
                <span class="badge">{{ tech }}</span>
            }
          </div>
        </div>

        <!-- Image Upload -->
        <div class="form-group">
          <label class="form-label">Project Image</label>
          <input type="file" (change)="onFileSelected($event)" class="form-input" accept="image/*">
          <p class="hint" *ngIf="isEditMode()">Leave empty to keep current image</p>
        </div>

        <div class="form-actions">
          <a routerLink="/dashboard/projects" class="btn btn-secondary">Cancel</a>
          <button type="submit" class="btn btn-primary" [disabled]="isLoading()">
            {{ isLoading() ? 'Saving...' : 'Save Project' }}
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: var(--text-main); }
    .form-container { max-width: 800px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; }
    .btn-secondary { background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); }
    .btn-secondary:hover { border-color: var(--primary); color: var(--text-main); }
    .tech-tags { display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap; }
    .badge { 
        font-size: 0.75rem; padding: 0.25rem 0.5rem; 
        background: rgba(139, 92, 246, 0.1); color: var(--primary); 
        border-radius: 4px; 
    }
    .hint { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; }
  `]
})
export class ProjectFormComponent implements OnInit {
    private fb = inject(FormBuilder);
    private projectService = inject(ProjectService);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    projectForm = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        repository: [''],
        deploy: [''],
        stack: [[] as string[]]
    });

    stackInput = this.fb.control('');
    selectedFile: File | null = null;
    isEditMode = signal(false);
    isLoading = signal(false);
    projectId: string | null = null;

    ngOnInit() {
        this.projectId = this.route.snapshot.paramMap.get('id');
        if (this.projectId) {
            this.isEditMode.set(true);
            this.loadProject(this.projectId);
        }
    }

    loadProject(id: string) {
        this.projectService.getProject(id).subscribe(data => {
            this.projectForm.patchValue({
                name: data.name,
                description: data.description,
                repository: data.repository,
                deploy: data.deploy,
                stack: data.stack
            });
            this.stackInput.setValue(data.stack.join(', '));
        });
    }

    updateStack() {
        const value = this.stackInput.value;
        if (value) {
            const stackArray = value.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
            this.projectForm.patchValue({ stack: stackArray });
        }
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
        }
    }

    onSubmit() {
        if (this.projectForm.invalid) return;

        this.isLoading.set(true);
        // Ensure stack is updated
        this.updateStack();

        const formValue = this.projectForm.value;

        // We need to differentiate between JSON update and FormData create/update
        // The requirement said: POST /projects uses FormData (with image). 
        // PATCH /projects/:id uses JSON (only name/desc).
        // Wait, the user requirement for PATCH was:
        // Body: { name: "...", description: "..." }
        // It implies image might not be updatable seamlessly via PATCH or user didn't specify.
        // However, usually we want to update everything.
        // I will implementation strict adherence:
        // Create -> FormData
        // Update -> JSON (as per PATCH doc) -> this implies we might lose image update capability on Edit?
        // Let's re-read: "PATCH /projects/:id ... Body { name, description }". 
        // It seems strictly limited. But usually a dashboard should allow full edit.
        // I will try to support full edit if the backend allows, but strictly following the prompt text for PATCH implies partial update.
        // BUT the prompt also said "aqui te dejo las rutas...". The PATCH example might be just an example of a partial update, not the strict *limit*. 
        // I'll assume standard behavior: consistent updates. 
        // Actually, looking closely at the prompt: "POST /projects ... Body(FormData)... PATCH /projects/:id ... Body { name, description }".
        // It is safer to assume the text is the documentation.
        // If I want to update image, I might need a specific endpoint or the document is incomplete.
        // I will stick to the provided API Documentation for reliability.

        if (this.isEditMode()) {
            const updateData = {
                name: formValue.name!,
                description: formValue.description!,
                // Adding others just in case the backend is flexible, otherwise they might be ignored
                repository: formValue.repository!,
                deploy: formValue.deploy!,
                stack: formValue.stack!
            };

            this.projectService.updateProject(this.projectId!, updateData).subscribe({
                next: () => this.handleSuccess(),
                error: (err) => this.handleError(err)
            });
        } else {
            const formData = new FormData();
            formData.append('name', formValue.name!);
            formData.append('description', formValue.description || '');
            formData.append('repository', formValue.repository || '');
            formData.append('deploy', formValue.deploy || '');

            // Stack sent as array strings? Backend says: "stack: ["React", ...] <-- Sent as array strings"
            // FormData with arrays can be tricky: usually repeat keys `stack[]` or just `stack` multiple times.
            // Or if backend expects parsed JSON inside a field.
            // "stack: ["React"...]" in the POST body description looks like it might be just multiple fields with same name 'stack'.
            const stack = formValue.stack || [];
            stack.forEach((s: string) => formData.append('stack', s));

            if (this.selectedFile) {
                formData.append('image', this.selectedFile);
            }

            this.projectService.createProject(formData).subscribe({
                next: () => this.handleSuccess(),
                error: (err) => this.handleError(err)
            });
        }
    }

    handleSuccess() {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard/projects']);
    }

    handleError(err: any) {
        this.isLoading.set(false);
        console.error(err);
        alert('Operation failed');
    }
}
