import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './project-form.component.html',
  styleUrls: ['./project-form.component.css']
})
export class ProjectFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  projectForm = this.fb.group({
    name: ['', Validators.required],
    subtitle: [''],
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
      // console.log(data);
      const project = data.project;
      this.projectForm.patchValue({
        name: project.name,
        subtitle: project.subtitle,
        description: project.description,
        repository: project.repository,
        deploy: project.deploy,
        stack: project.stack
      });
      this.stackInput.setValue(project.stack.join(', '));
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

    if (this.isEditMode()) {
      const updateData = {
        name: formValue.name!,

        subtitle: formValue.subtitle!,
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
      formData.append('subtitle', formValue.subtitle || '');
      formData.append('description', formValue.description || '');
      formData.append('repository', formValue.repository || '');
      formData.append('deploy', formValue.deploy || '');

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
