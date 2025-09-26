import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { User, Role, Privilege, Group } from '../../models';
import { UserManagementService, CreateUserRequest, UpdateUserRequest, UserPage } from '../../services/user-management.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    NzSpinModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzButtonModule,
    NzModalModule,
    NzPopconfirmModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule,
    NzPaginationModule,
    NzTagModule,
    NzDividerModule,
    NzSpaceModule,
    NzEmptyModule,
    NzAvatarModule,
    NzToolTipModule,
    NzCheckboxModule,
    NzIconModule
  ],
  providers: [UserManagementService, NzModalService, NzMessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  loading = true;
  submitting = false;
  total = 0;
  pageSize = 10;
  pageIndex = 1;

  // Search functionality
  searchQuery = '';
  searching = false;

  // Current user
  currentUser: User | null = null;
  isProfileModalVisible = false;

  // Modal states
  isCreateModalVisible = false;
  isEditModalVisible = false;
  isDetailModalVisible = false;

  // Forms
  createUserForm!: FormGroup;
  editUserForm!: FormGroup;

  // Data for dropdowns
  availableRoles: Role[] = [];
  availablePrivileges: Privilege[] = [];
  availableGroups: Group[] = [];

  // Selected user for editing/details
  selectedUser: User | null = null;

  constructor(
    private router: Router,
    private userManagementService: UserManagementService,
    private modalService: NzModalService,
    private messageService: NzMessageService,
    private fb: FormBuilder
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadReferenceData();
    this.loadCurrentUser();
  }

  initializeForms(): void {
    this.createUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      disabled: [false],
      roles: [[]],
      privileges: [[]],
      groups: [[]]
    });

    this.editUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phoneNumber: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
      disabled: [false],
      roles: [[]],
      privileges: [[]],
      groups: [[]]
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userManagementService.getUsers(this.pageIndex - 1, this.pageSize).subscribe({
      next: (data: UserPage) => {
        this.users = data.content || [];
        this.total = data.totalElements || 0;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        
        // Handle specific error cases
        if (error.status === 401) {
          // JWT interceptor will handle this automatically
          return;
        } else if (error.status === 403) {
          this.messageService.error('You do not have permission to view users');
        } else if (error.status === 500) {
          this.messageService.error('Server error. Please try again later.');
        } else {
          this.messageService.error('Failed to load users');
        }
        
        this.loading = false;
      }
    });
  }

  loadReferenceData(): void {
    // Load roles, privileges, and groups for dropdowns
    this.userManagementService.getAllRoles().subscribe({
      next: (roles) => this.availableRoles = roles,
      error: (error) => console.error('Error loading roles:', error)
    });

    this.userManagementService.getAllPrivileges().subscribe({
      next: (privileges) => this.availablePrivileges = privileges,
      error: (error) => console.error('Error loading privileges:', error)
    });

    this.userManagementService.getAllGroups().subscribe({
      next: (groups) => this.availableGroups = groups,
      error: (error) => console.error('Error loading groups:', error)
    });
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.loadUsers();
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1;
    this.loadUsers();
  }

  // CRUD Operations
  createUser(): void {
    if (this.createUserForm.valid) {
      this.loading = true;
      const formData = this.createUserForm.value;
      
      // Create the user payload matching the backend expected format
      const userData: CreateUserRequest = {
        username: formData.username,
        firstName: formData.firstName,
        middleName: formData.middleName || null,
        surname: formData.surname,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber || null,
        password: formData.password,
        disabled: formData.disabled || false
      };

      // Set role UUIDs if roles are selected
      if (formData.roles && formData.roles.length > 0) {
        userData.roles = formData.roles;
      }

      // Set group UUIDs if groups are selected
      if (formData.groups && formData.groups.length > 0) {
        userData.groups = formData.groups;
      }

      console.log('Creating user with payload:', userData);
      
      this.userManagementService.createUser(userData).subscribe({
        next: (user) => {
          this.messageService.success('User created successfully');
          this.isCreateModalVisible = false;
          this.createUserForm.reset();
          this.initializeForms(); // Reset form to initial state
          this.loadUsers();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          console.error('Error details:', error.error);
          this.loading = false;
          
          // Handle specific error messages
          if (error.status === 409) {
            this.messageService.error('Username already exists. Please choose a different username.');
          } else if (error.status === 400) {
            this.messageService.error('Invalid user data. Please check all fields and try again.');
          } else if (error.status === 422) {
            this.messageService.error('User data validation failed. Please check required fields.');
          } else {
            this.messageService.error('Failed to create user. Please try again.');
          }
        }
      });
    } else {
      // Mark all invalid fields as touched to show validation errors
      Object.values(this.createUserForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.messageService.warning('Please fill in all required fields correctly.');
    }
  }

  editUser(user: User): void {
    this.loading = true;
    
    // Fetch complete user details from the API first
    this.userManagementService.getUserById(user.uuid).subscribe({
      next: (detailedUser) => {
        this.selectedUser = detailedUser;
        
        // Populate the edit form with detailed user data
        this.editUserForm.patchValue({
          username: detailedUser.username,
          firstName: detailedUser.firstName,
          middleName: detailedUser.middleName,
          surname: detailedUser.surname,
          email: detailedUser.email,
          phoneNumber: detailedUser.phoneNumber,
          disabled: detailedUser.disabled
        });

        // Load user-specific roles, privileges, and groups in parallel
        const roleIds = detailedUser.roles ? detailedUser.roles.map(r => r.uuid) : [];
        const groupIds = detailedUser.groups ? detailedUser.groups.map(g => g.uuid) : [];
        
        this.editUserForm.patchValue({
          roles: roleIds,
          groups: groupIds
        });

        // Load user privileges separately since they might not be in the main user object
        this.userManagementService.getUserPrivileges(user.uuid).subscribe({
          next: (privileges) => {
            this.editUserForm.patchValue({ privileges: privileges.map(p => p.uuid) });
          },
          error: (error) => {
            console.warn('Failed to load user privileges:', error);
          }
        });

        this.isEditModalVisible = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.loading = false;
        
        if (error.status === 404) {
          this.messageService.error('User not found.');
        } else {
          this.messageService.error('Failed to load user details for editing.');
          // Fallback to basic user data if API fails
          this.selectedUser = user;
          this.editUserForm.patchValue({
            username: user.username,
            firstName: user.firstName,
            middleName: user.middleName,
            surname: user.surname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            disabled: user.disabled
          });
          this.isEditModalVisible = true;
        }
      }
    });
  }

  updateUser(): void {
    if (this.editUserForm.valid && this.selectedUser) {
      this.loading = true;
      const userData: UpdateUserRequest = this.editUserForm.value;

      this.userManagementService.updateUser(this.selectedUser.uuid, userData).subscribe({
        next: (user) => {
          this.messageService.success('User updated successfully');
          this.isEditModalVisible = false;
          this.selectedUser = null;
          this.editUserForm.reset();
          this.loadUsers();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.loading = false;
          
          // Handle specific error messages
          if (error.status === 404) {
            this.messageService.error('User not found.');
          } else if (error.status === 409) {
            this.messageService.error('Username already exists. Please choose a different username.');
          } else if (error.status === 400) {
            this.messageService.error('Invalid user data. Please check all fields.');
          } else {
            this.messageService.error('Failed to update user. Please try again.');
          }
        }
      });
    } else {
      // Mark all invalid fields as touched to show validation errors
      Object.values(this.editUserForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.markAsTouched();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.messageService.warning('Please fill in all required fields correctly.');
    }
  }

  deleteUser(user: User): void {
    // Show confirmation dialog
    this.modalService.confirm({
      nzTitle: 'Delete User',
      nzContent: `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`,
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.loading = true;
        this.userManagementService.deleteUser(user.uuid).subscribe({
          next: () => {
            this.messageService.success(`User "${user.username}" deleted successfully`);
            this.loadUsers();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.loading = false;
            
            // Handle specific error messages
            if (error.status === 404) {
              this.messageService.error('User not found.');
            } else if (error.status === 403) {
              this.messageService.error('You do not have permission to delete this user.');
            } else if (error.status === 409) {
              this.messageService.error('Cannot delete user. User may have associated data.');
            } else {
              this.messageService.error('Failed to delete user. Please try again.');
            }
          }
        });
      }
    });
  }

  viewUserDetails(user: User): void {
    this.loading = true;
    
    // Fetch complete user details from the API
    this.userManagementService.getUserById(user.uuid).subscribe({
      next: (detailedUser) => {
        this.selectedUser = detailedUser;
        this.isDetailModalVisible = true;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.loading = false;
        
        if (error.status === 404) {
          this.messageService.error('User not found.');
        } else {
          this.messageService.error('Failed to load user details.');
          // Fallback to basic user data if API fails
          this.selectedUser = user;
          this.isDetailModalVisible = true;
        }
      }
    });
  }

  // Modal controls
  showCreateModal(): void {
    this.isCreateModalVisible = true;
  }

  handleCancel(): void {
    this.isCreateModalVisible = false;
    this.isEditModalVisible = false;
    this.isDetailModalVisible = false;
    this.isProfileModalVisible = false;
    this.selectedUser = null;
    this.createUserForm.reset();
    this.editUserForm.reset();
  }

  // Current User Profile Management
  loadCurrentUser(): void {
    this.userManagementService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading current user:', error);
        if (error.status !== 401) { // Don't show error for 401 as interceptor handles it
          this.messageService.error('Failed to load current user profile');
        }
      }
    });
  }

  showCurrentUserProfile(): void {
    if (this.currentUser) {
      this.selectedUser = this.currentUser;
      this.isProfileModalVisible = true;
    }
  }

  // Search Functionality
  onSearchQueryChange(): void {
    if (this.searchQuery.trim().length > 2) {
      this.searchUsers();
    } else if (this.searchQuery.trim().length === 0) {
      this.loadUsers();
    }
  }

  searchUsers(): void {
    if (this.searchQuery.trim().length === 0) {
      this.loadUsers();
      return;
    }

    this.searching = true;
    this.userManagementService.searchUsers(this.searchQuery, this.pageIndex - 1, this.pageSize).subscribe({
      next: (data: UserPage) => {
        this.users = data.content || [];
        this.total = data.totalElements || 0;
        this.searching = false;
      },
      error: (error) => {
        console.error('Error searching users:', error);
        if (error.status !== 401) {
          this.messageService.error('Failed to search users');
        }
        this.searching = false;
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.loadUsers();
  }

  // Bulk Operations
  selectedUserUuids: Set<string> = new Set();

  onUserSelectionChange(uuid: string, selected: boolean): void {
    if (selected) {
      this.selectedUserUuids.add(uuid);
    } else {
      this.selectedUserUuids.delete(uuid);
    }
  }

  onSelectAllUsers(selected: boolean): void {
    if (selected) {
      this.users.forEach(user => this.selectedUserUuids.add(user.uuid));
    } else {
      this.selectedUserUuids.clear();
    }
  }

  bulkDeleteSelected(): void {
    if (this.selectedUserUuids.size === 0) {
      this.messageService.warning('Please select users to delete');
      return;
    }

    this.modalService.confirm({
      nzTitle: 'Delete Multiple Users',
      nzContent: `Are you sure you want to delete ${this.selectedUserUuids.size} selected users? This action cannot be undone.`,
      nzOkText: 'Yes, Delete All',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.loading = true;
        this.userManagementService.bulkDeleteUsers(Array.from(this.selectedUserUuids)).subscribe({
          next: () => {
            this.messageService.success(`${this.selectedUserUuids.size} users deleted successfully`);
            this.selectedUserUuids.clear();
            this.loadUsers();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error bulk deleting users:', error);
            this.loading = false;
            if (error.status !== 401) {
              this.messageService.error('Failed to delete selected users');
            }
          }
        });
      }
    });
  }

  // User Status Toggle
  toggleUserStatus(user: User): void {
    const action = user.disabled ? 'enable' : 'disable';
    const newStatus = !user.disabled;

    this.modalService.confirm({
      nzTitle: `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      nzContent: `Are you sure you want to ${action} user "${user.username}"?`,
      nzOkText: `Yes, ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      nzOkType: 'primary',
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        this.userManagementService.toggleUserStatus(user.uuid, newStatus).subscribe({
          next: (updatedUser) => {
            this.messageService.success(`User "${user.username}" ${action}d successfully`);
            // Update user in the list
            const index = this.users.findIndex(u => u.uuid === user.uuid);
            if (index !== -1) {
              this.users[index] = updatedUser;
            }
          },
          error: (error) => {
            console.error(`Error ${action}ing user:`, error);
            if (error.status !== 401) {
              this.messageService.error(`Failed to ${action} user`);
            }
          }
        });
      }
    });
  }
}
