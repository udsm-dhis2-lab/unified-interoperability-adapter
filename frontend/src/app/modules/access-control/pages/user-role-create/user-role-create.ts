import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { RolesService } from '../../services/roles.service';
import { DualListSelectComponent } from 'src/app/shared/components/dual-list-select/dual-list-select';
import { NzMessageService } from 'ng-zorro-antd/message';

interface AuthorityGroup {
  uuid?: string;
  roleName: string;
  description?: string;
  privileges: {
    uuid: string;
    privilegeName: string;
    description: string;
  }[];
}

@Component({
  selector: 'app-user-role-create',
  standalone: true,
  imports: [CommonModule, FormsModule, DualListSelectComponent, ...ZORRO_MODULES],
  templateUrl: './user-role-create.html',
  styleUrls: ['./user-role-create.scss'],
})
export class UserRoleCreate {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly rolesService = inject(RolesService);
  private readonly message = inject(NzMessageService);
  
  roleUuid = this.route.snapshot.paramMap.get('roleId');

  privileges = signal<any[]>([]);
  selectedPriviledges: any[] = [];
  roleName: string = '';
  description: string = ''

  constructor() {}

  ngOnInit(){
    this.getPrivileges();

    if(this.roleUuid){
      this.getRole(this.roleUuid);
    }
  }

  getPrivileges(){
    this.rolesService.getPrivileges().subscribe((response: any) => {
      this.privileges.set(response);
    })
  }

  getRole(roleUuid: string){
    this.rolesService.getRole(roleUuid).subscribe({
      next: (response: any) => {
        this.roleName = response?.roleName;
        this.description = response?.description;
        this.selectedPriviledges = response?.privileges?.map((p: any) => p.privilegeName);
      },
      error: (error) => {
        this.message.error("Failed to load role details.")
        console.log(error);
      }
    })
  }

  save(): void {
    if(!this.roleName.trim()){
      this.message.error("Role name must be filled.")
      return;
    }

    let roleToSave: any = {
      roleName: this.roleName,
      description: this.description,
      privileges: this.selectedPriviledges
    }

    if(this.roleUuid){
      roleToSave.uuid = this.roleUuid;
      this.rolesService.updateRole(this.roleUuid, roleToSave).subscribe({
        next: (response: any) => {
          this.message.success("Role updated successfully.")
          this.router.navigate(['/access-control/user-roles']);
        },
        error: (error) => {
          console.log(error)
          this.message.error("Failed to update role.")
        }
      })
      return;
    }

    this.rolesService.createRole([roleToSave]).subscribe({
      next: (response: any) => {
        this.message.success("Role created successfully.")
        this.router.navigate(['/access-control/user-roles']);
      },
      error: (error) => {
        console.log(error)
        this.message.error("Failed to create role.")
      }
    })
  }

  cancel(): void {
    this.router.navigate(['/access-control/user-roles']);
  }
}
