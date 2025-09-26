import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule, NzButtonComponent } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { AuthService, User, getInitials } from '@iadapter-applications/hdu-api-top-bar-menu';

@Component({
  selector: 'lib-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzButtonComponent,
    NzIconModule,
    NzDividerModule,
    NzTagModule,
    NzAvatarModule,
    NzGridModule,
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;
  userInitials = '';
  accountForm: FormGroup;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService
  ) {
    this.accountForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      username: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user: User | null) => {
      if (user) {
        this.currentUser = user;
        this.userInitials = getInitials(`${user.firstName} ${user.lastName}`);
        
        // Update form with user data
        this.accountForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        });
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // Reset form to original values if canceling
      if (this.currentUser) {
        this.accountForm.patchValue({
          firstName: this.currentUser.firstName,
          lastName: this.currentUser.lastName,
          email: this.currentUser.email
        });
      }
    }
  }

  saveProfile(): void {
    if (this.accountForm.valid && this.currentUser) {
      const formData = this.accountForm.value;
      
      // Here you would typically call an API to update the user profile
      // For now, we'll just show a success message
      this.message.success('Profile updated successfully');
      
      // Update current user data (in a real app, this would come from the API response)
      this.currentUser = {
        ...this.currentUser,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        displayName: `${formData.firstName} ${formData.lastName}`
      };

      this.userInitials = getInitials(`${formData.firstName} ${formData.lastName}`);
      this.isEditing = false;
    } else {
      this.message.error('Please fill in all required fields correctly');
    }
  }

  changePassword(): void {
    // This would typically open a change password modal
    this.message.info('Change password functionality to be implemented');
  }
}