import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { UsersService } from '../../services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Role, User } from '../../interfaces/access-control.interfaces';
import { ro } from 'date-fns/locale';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, ...ZORRO_MODULES, FormsModule],
  templateUrl: './user-create.html',
  styleUrls: ['./user-create.scss'],
})
export class UserCreate {
  private readonly router: Router = inject(Router);
  readonly userService = inject(UsersService);
  private readonly message = inject(NzMessageService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  userUuid = this.route.snapshot.paramMap.get('userId');

  isInitialLoading = signal(false)
  isSaving = signal(false)

  user: User = {
    username: '',
    firstName: '',
    middleName: '',
    surname: '',
    email: '',
    phoneNumber: '',
    password: '',
    disabled: false,
    roles: []
  }

  selectedRoles: Role[] = []

  confirmPassword: string = ''

  roles: Role[] = []


  constructor() {}

  ngOnInit(){
    this.getRoles();
    if(this.userUuid){
      this.getUser(this.userUuid)
    }
  }

  getUser(userUuid: string){
    this.isInitialLoading.set(true)
    this.userService.getUsers(userUuid).subscribe({
      next: (response: any) => {
        this.user = {
          ...response?.user,
          uuid: this.userUuid
        };
        this.selectedRoles = this.user.roles;
      },
      error: (error) => {
        this.message.error("Failed to update this user. Upon saving you will be creating the new one.")
        console.log(error)
      },
      complete: () => {
        this.isInitialLoading.set(false);
      }
    })
  }
  
  getRoles() {
    this.userService.getRoles().subscribe({
      next: (rolesResponse: any) => {
        this.roles = rolesResponse;
      }
    });
  }

  compareRoles = (o1: any, o2: any): boolean => (o1 && o2 ? o1.uuid === o2.uuid : o1 === o2);

  save(): void {
    if (!this.user.email || !this.user.username || !this.user.firstName || !this.user.surname || ((!this.user.password || !this.confirmPassword) && !this.userUuid )) {
      this.message.error("Make sure to fill all the mandatory fields.")
      return;
    }

    if(this.user.password !== this.confirmPassword && !this.userUuid){
      this.message.error("Passwords do not match!")
      return;
    }

    this.user.roles = this.selectedRoles;
    
    this.isSaving.set(true);

    if(this.userUuid){
      this.userService.updateUser(this.user).subscribe({
        next: (response: any) => {
          this.message.success("User updated successfully.")
          this.router.navigate(['/access-control/users']);
        },
        error: (error) => {
          console.log(error)
          this.message.success("Failed to update user.")
        },
        complete: () => {
          this.isSaving.set(false);
        }
      })
    } else {
      this.userService.saveUser(this.user).subscribe({
        next: (response: any) => {
          this.message.success("User created successfully.")
          this.router.navigate(['/access-control/users']);
        },
        error: (error) => {
          console.log(error)
          this.message.success("Failed to create user.")
        },
        complete: () => {
          this.isSaving.set(false);
        }
      })
    }

  }

  cancel(): void {
    this.router.navigate(['/access-control/users']);
  }
}
