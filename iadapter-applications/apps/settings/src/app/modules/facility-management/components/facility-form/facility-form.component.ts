import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FacilityManagementService } from '../../services/facility-management.service';
import { FacilityRegistration } from '../../models/facility.model';
import { BehaviorSubject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

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
        NzGridModule,
        NzSwitchModule,
        NzCheckboxModule,
        NzDividerModule,
        NzInputNumberModule,
        NzSelectModule,
        NzIconModule
    ],
    templateUrl: './facility-form.component.html',
    styleUrls: ['./facility-form.component.less']
})
export class FacilityFormComponent implements OnInit {
    facilityForm!: FormGroup;
    loading = false;
    isEditMode = false;
    isMediatorOnlyMode = false;
    facilityId?: string;
    configureMediatorEnabled = false;

    hfrFacilityList: any[] = [];
    selectedHfrFacility: any;
    isLoading = false;
    totalPages = 1;

    filters = { name: '', code: '', page: 1 };
    private searchSubject$ = new BehaviorSubject(this.filters);

    constructor(
        private fb: FormBuilder,
        private facilityService: FacilityManagementService,
        private message: NzMessageService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.initializeForm();

        this.isMediatorOnlyMode = this.route.snapshot.url.some(segment => segment.path === 'mediator');

        if (this.isMediatorOnlyMode) {
            this.configureMediatorEnabled = true;
        }

        this.facilityId = this.route.snapshot.paramMap.get('id') || undefined;
        if (this.facilityId) {
            this.isEditMode = true;
            this.loadFacility();
        }

        this.searchSubject$.pipe(
            debounceTime(400),
            tap(() => this.isLoading = true),
            switchMap((filters) => 
                this.facilityService.getHfrFacilities(filters.name, filters.code, this.filters.page).pipe(
                    catchError(err => {
                        console.error('Search failed', err);
                        return of({ items: [] });
                    })
                )
            )
        ).subscribe((res: any) => {
            const newItems = res.results || [];
            
            if (this.filters.page === 1) {
                this.hfrFacilityList = newItems;
            } else {
                this.hfrFacilityList = [...this.hfrFacilityList, ...newItems];
            }
            this.totalPages = res?.pager?.totalPages;
            this.isLoading = false;
        });
    }

    triggerSearch() {
        this.filters.page = 1;
        this.searchSubject$.next({ ...this.filters });
    }

    onSearch(val: string) {
        this.filters.name = val;
        this.triggerSearch();
    }

    loadMore() {
        if (!this.isLoading && this.totalPages > this.filters.page) {
            this.filters.page++;
            this.searchSubject$.next({ ...this.filters });
        }
    }

    onSelectFacility(id: string) {
        const selectedFacility = this.hfrFacilityList.find(f => f.id === id);
        if (selectedFacility) {
            this.facilityForm.patchValue({
                code: selectedFacility.code || selectedFacility.id,
                name: selectedFacility.name
            });
        }
    }

    initializeForm(): void {
        this.facilityForm = this.fb.group({
            allowed: [true],
            params: [''],

            configureMediatorNow: [false],
            mediatorName: [''],
            baseUrl: [''],
            path: [''],
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
        const path = this.facilityForm.get('path');
        const username = this.facilityForm.get('username');
        const password = this.facilityForm.get('password');

        if (this.configureMediatorEnabled) {
            mediatorName?.setValidators([Validators.required]);
            baseUrl?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
            path?.setValidators([Validators.required]);
            username?.setValidators([Validators.required]);
            password?.setValidators([Validators.required]);
        } else {
            mediatorName?.clearValidators();
            baseUrl?.clearValidators();
            path?.clearValidators();
            username?.clearValidators();
            password?.clearValidators();
        }

        mediatorName?.updateValueAndValidity();
        baseUrl?.updateValueAndValidity();
        username?.updateValueAndValidity();
        password?.updateValueAndValidity();
    }

    loadFacility(): void {
        if (!this.facilityId) return;

        this.loading = true;
        this.facilityService.getFacilityById(this.facilityId).subscribe({
            next: (response) => {
                this.facilityForm.patchValue({
                    code: response.code,
                    name: response.name,
                    allowed: response.allowed,
                    params: response.params || ''
                });

                // Load mediator configuration if it exists
                if (response.mediatorConfigured && (this.isMediatorOnlyMode || this.configureMediatorEnabled)) {
                    this.facilityForm.patchValue({
                        mediatorName: response.name,
                        baseUrl: response.mediatorBaseUrl || '',
                        path: response.mediatorPath || ''
                    });
                }

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
        if(!this.selectedHfrFacility){
            return;
        }

        if (this.facilityForm.invalid) {
            Object.values(this.facilityForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
            return;
        }

        if (this.isMediatorOnlyMode) {
            this.configureMediatorOnly();
            return;
        }

        const formValue = this.facilityForm.getRawValue();

        const registration: FacilityRegistration = {
            code: this.selectedHfrFacility?.Fac_IDNumber,
            name: `${this.selectedHfrFacility?.Name} ${this.selectedHfrFacility?.FacilityType}`,
            allowed: formValue.allowed,
            params: formValue.params || null
        };

        if (this.configureMediatorEnabled) {
            registration.mediatorConfig = {
                baseUrl: formValue.baseUrl,
                path: formValue.path,
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
        if (!this.facilityId) return;

        const formValue = this.facilityForm.value;
        const mediatorConfig = {
            baseUrl: formValue.baseUrl,
            path: formValue.path,
            authType: 'BASIC',
            authToken: btoa(`${formValue.username}:${formValue.password}`),
            category: 'REFERRAL'
        };

        this.loading = true;
        this.facilityService.configureMediator(this.facilityId!, mediatorConfig).subscribe({
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
