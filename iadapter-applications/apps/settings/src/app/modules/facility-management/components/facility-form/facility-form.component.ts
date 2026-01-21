import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FacilityManagementService } from '../../services/facility-management.service';
import { FacilityRegistration } from '../../models/facility.model';

@Component({
    selector: 'app-facility-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzCardModule,
        NzGridModule,
        NzSwitchModule,
        NzCheckboxModule,
        NzDividerModule,
        NzInputNumberModule
    ],
    templateUrl: './facility-form.component.html',
    styleUrls: ['./facility-form.component.less']
})
export class FacilityFormComponent implements OnInit {
    facilityForm!: FormGroup;
    loading = false;
    isEditMode = false;
    isMediatorOnlyMode = false;
    facilityCode?: string;
    configureMediatorEnabled = false;

    constructor(
        private fb: FormBuilder,
        private facilityService: FacilityManagementService,
        private message: NzMessageService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initializeForm();

        this.facilityCode = this.route.snapshot.paramMap.get('code') || undefined;
        if (this.facilityCode) {
            this.isEditMode = true;
            this.loadFacility();
        }
    }

    initializeForm(): void {
        this.facilityForm = this.fb.group({
            code: ['', [Validators.required, Validators.maxLength(50)]],
            name: ['', [Validators.required, Validators.maxLength(255)]],
            allowed: [true],
            params: [''],

            configureMediatorNow: [false],
            mediatorName: [''],
            baseUrl: [''],
            username: [''],
            password: ['']
        });

        this.facilityForm.get('configureMediatorNow')?.valueChanges.subscribe(enabled => {
            this.configureMediatorEnabled = enabled;
            this.updateMediatorValidators();
        });
    }

    updateMediatorValidators(): void {
        const mediatorName = this.facilityForm.get('mediatorName');
        const baseUrl = this.facilityForm.get('baseUrl');
        const username = this.facilityForm.get('username');
        const password = this.facilityForm.get('password');

        if (this.configureMediatorEnabled) {
            mediatorName?.setValidators([Validators.required]);
            baseUrl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
            username?.setValidators([Validators.required]);
            password?.setValidators([Validators.required]);
        } else {
            mediatorName?.clearValidators();
            baseUrl?.clearValidators();
            username?.clearValidators();
            password?.clearValidators();
        }

        mediatorName?.updateValueAndValidity();
        baseUrl?.updateValueAndValidity();
        username?.updateValueAndValidity();
        password?.updateValueAndValidity();
    }

    loadFacility(): void {
        if (!this.facilityCode) return;

        this.loading = true;
        this.facilityService.getFacilityByCode(this.facilityCode).subscribe({
            next: (response) => {
                this.facilityForm.patchValue({
                    code: response.code,
                    name: response.name,
                    allowed: response.allowed,
                    params: response.params || ''
                });

                this.facilityForm.get('code')?.disable();

                this.loading = false;
            },
            error: (error) => {
                this.message.error('Failed to load facility details');
                console.error('Load facility error:', error);
                this.loading = false;
                this.router.navigate(['../'], { relativeTo: this.route });
            }
        });
    }

    submitForm(): void {
        if (this.facilityForm.invalid) {
            Object.values(this.facilityForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }

        // If mediator-only mode, only update mediator configuration
        if (this.isMediatorOnlyMode) {
            this.configureMediatorOnly();
            return;
        }

        const formValue = this.facilityForm.getRawValue();

        const registration: FacilityRegistration = {
            code: formValue.code,
            name: formValue.name,
            allowed: formValue.allowed,
            params: formValue.params || null
        };

        // Add mediator configuration if enabled
        if (this.configureMediatorEnabled) {
            registration.mediatorConfig = {
                baseUrl: formValue.baseUrl,
                authType: 'BASIC',
                authToken: btoa(`${formValue.username}:${formValue.password}`),
                category: 'REFERRAL'
            };
        }

        this.loading = true;
        this.facilityService.registerFacility(registration).subscribe({
            next: () => {
                this.message.success('Facility registered successfully');
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: (error) => {
                this.message.error('Failed to register facility');
                console.error('Registration error:', error);
                this.loading = false;
            }
        });
    }

    configureMediatorOnly(): void {
        if (!this.facilityCode) return;

        const formValue = this.facilityForm.value;
        const mediatorConfig = {
            baseUrl: formValue.baseUrl,
            authType: 'BASIC',
            authToken: btoa(`${formValue.username}:${formValue.password}`),
            category: 'REFERRAL'
        };

        this.loading = true;
        this.facilityService.configureMediator(this.facilityCode, mediatorConfig).subscribe({
            next: () => {
                this.message.success('Referral configuration updated successfully');
                this.router.navigate(['../../'], { relativeTo: this.route });
            },
            error: (error) => {
                this.message.error('Failed to configure referral endpoint');
                console.error('Configuration error:', error);
                this.loading = false;
            }
        });
    }

    cancel(): void {
        this.router.navigate(['../'], { relativeTo: this.route });
    }
}
