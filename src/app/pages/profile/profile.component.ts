import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { IUser } from '../../core/models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    userService = inject(UserService);
    fb = inject(FormBuilder);

    user = signal<IUser | null>(null);
    isEditing = signal(false);
    isLoading = signal(false);

    profileForm: FormGroup;
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;

    constructor() {
        this.profileForm = this.fb.group({
            name: ['', Validators.required],
            profession: [''],
            bio: [''],
            skills: [''],
            socialLinks: this.fb.group({
                github: [''],
                linkedin: ['']
            })
        });
    }

    ngOnInit() {
        this.loadUser();
    }

    loadUser() {
        this.isLoading.set(true);
        // Assuming 'me' is a valid identifier or handled by the backend
        this.userService.getUser('me').subscribe({
            next: (user) => {
                this.user.set(user);
                this.isLoading.set(false);
                this.patchForm(user);
            },
            error: (err) => {
                console.error('Failed to load user', err);
                this.isLoading.set(false);
            }
        });
    }

    patchForm(user: IUser) {
        this.profileForm.patchValue({
            name: user.name,
            profession: user.profession,
            bio: user.bio,
            skills: user.skills ? user.skills.join(', ') : '',
            socialLinks: {
                github: user.socialLinks?.github || '',
                linkedin: user.socialLinks?.linkedin || ''
            }
        });
    }

    toggleEdit() {
        this.isEditing.update(v => !v);
        if (!this.isEditing() && this.user()) {
            this.patchForm(this.user()!);
            this.selectedFile = null;
            this.imagePreview = null;
        }
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];

            const reader = new FileReader();
            reader.onload = () => {
                this.imagePreview = reader.result;
            };
            reader.readAsDataURL(this.selectedFile);
        }
    }

    onSubmit() {
        if (this.profileForm.invalid) return;

        this.isLoading.set(true);
        const formVal = this.profileForm.value;

        const skillsArray = formVal.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);

        const updateData = {
            ...formVal,
            skills: skillsArray
        };

        const userId = this.user()?._id || 'me';

        this.userService.updateUser(userId, updateData).subscribe({
            next: (updatedUser) => {
                // If image is selected, upload it
                if (this.selectedFile) {
                    this.userService.updateUserImage(userId, this.selectedFile).subscribe({
                        next: (res) => {
                            // Assuming res.image is the new url
                            this.user.set({ ...updatedUser, avatar: res.image }); // Update avatar locally
                            this.finishUpdate();
                        },
                        error: (err) => {
                            console.error('Failed to upload image', err);
                            // Even if image fails, user data was updated? 
                            // But we should probably just update the user signal with what we have
                            this.user.set(updatedUser);
                            this.finishUpdate();
                        }
                    });
                } else {
                    this.user.set(updatedUser);
                    this.finishUpdate();
                }
            },
            error: (err) => {
                console.error('Failed to update user', err);
                this.isLoading.set(false);
            }
        });
    }

    finishUpdate() {
        this.isEditing.set(false);
        this.isLoading.set(false);
        this.selectedFile = null;
        this.imagePreview = null;
    }
}
