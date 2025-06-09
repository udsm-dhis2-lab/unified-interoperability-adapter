import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { ServiceTerminologyConstants } from '../../models/constants/service-terminology-constants';
import { ServicesTerminologyServiceService } from '../../services/services-terminology-service.service';


@Component({
  selector: 'app-general-codes',
  templateUrl: './general-codes.component.html',
  styleUrl: './general-codes.component.css',
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class GeneralCodesComponent implements OnInit {
  @Output() codeAdded = new EventEmitter<void>();
  generalCodeForm!: FormGroup;
  isSubmitting: boolean = false;

  alert = {
    show: false,
    type: 'success' as 'success' | 'info' | 'error' | 'warning',
    message: '',
  };

  generalCodeCategory: { key: string; name: string }[] = [
    { key: 'billings', name: 'Billings' },
    { key: 'insurances', name: 'Insurances' }
  ];


  constructor(private fb: FormBuilder, private serviceTerminologyService: ServicesTerminologyServiceService) { }

  ngOnInit(): void {
    this.generalCodeForm = this.fb.group({
      generalCodeType: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      key: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  get generalCodeType() {
    return this.generalCodeForm.get('generalCodeType');
  }
  get code() {
    return this.generalCodeForm.get('code');
  }
  get name() {
    return this.generalCodeForm.get('name');
  }

  get key() {
    return this.generalCodeForm.get('key');
  }

  submitForm() {
    this.isSubmitting = true;
    if (this.generalCodeForm.valid) {
      var generalCode = {
        namespace: this.generalCodeType?.value,
        value: {
          code: this.code?.value,
          name: this.name?.value,
        },
        dataKey: this.key?.value,
        datastoreGroup: ServiceTerminologyConstants.GENERAL_CODE_GROUP
      };

      try {
        const response = this.serviceTerminologyService.saveServiceCode(generalCode).subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.clearForm();
            this.showAlert('success', 'General code was added successfully');
            this.codeAdded.emit();
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.clearForm();
            this.showAlert('error', error);
          }
        });
      } catch (error) {
        this.isSubmitting = false;
        this.clearForm();
        this.showAlert('error', error as string);
      }
    } else {
      this.isSubmitting = false;
      Object.values(this.generalCodeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onCloseAlert(): void {
    this.alert.show = false;
  }

  showAlert(type: 'success' | 'info' | 'error' | 'warning', message: string): void {
    this.alert = { show: true, type, message };
    setTimeout(() => this.onCloseAlert(), 5000);
  }

  clearForm() {
    this.generalCodeForm.reset();
  }
}