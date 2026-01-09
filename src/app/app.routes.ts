import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { ProjectListComponent } from './pages/projects/project-list/project-list.component';
import { ProjectFormComponent } from './pages/projects/project-form/project-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    {
        path: 'dashboard',
        component: DashboardLayoutComponent,
        children: [
            { path: '', redirectTo: 'projects', pathMatch: 'full' },
            { path: 'projects', component: ProjectListComponent },
            { path: 'projects/new', component: ProjectFormComponent },
            { path: 'projects/edit/:id', component: ProjectFormComponent },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
            }
        ]
    }
];
