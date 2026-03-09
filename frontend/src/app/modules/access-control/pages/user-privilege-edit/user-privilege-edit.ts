import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZORRO_MODULES } from '@hdu/shared';
import { RolesService } from '../../services/roles.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-privilege-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ...ZORRO_MODULES],
  templateUrl: './user-privilege-edit.html',
  styleUrls: ['./user-privilege-edit.scss'],
})
export class UserPriviledgeEdit implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router: Router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rolesService = inject(RolesService);
  private readonly message = inject(NzMessageService)

  privilegeUuid?: any = this.route.snapshot.paramMap.get('privilegeId');

  privilegeName?: string;
  description?: string;
  

  constructor() {}

  ngOnInit(): void {
    if(this.privilegeUuid){
      this.getPrivilege(this.privilegeUuid);
    } else {
      this.router.navigate(['/access-control/user-privileges']);
    }
  }

  getPrivilege(privilegeUuid: string): void {
    this.rolesService.getPrivileges(privilegeUuid).subscribe({
      next: (response: any) => {
        this.privilegeName = response?.privilegeName;
        this.description = response?.description;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Failed to load privileges:", error);
        this.message.error('Failed to load privilege details');
        this.router.navigate(['/access-control/user-privileges']);
      }
    });
  }

  save(): void {
    this.rolesService.updatePrivileges(this.privilegeUuid!, {
      privilegeName: this.privilegeName,
      description: this.description
    }).subscribe({
      next: () => {
        this.message.success('Privilege updated successfully');
        this.router.navigate(['/access-control/user-privileges']);
      },
      error: (error) => {
        console.error("Failed to update privilege:", error);
        this.message.error('Failed to update privilege');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/access-control/user-privileges']);
  }
}
