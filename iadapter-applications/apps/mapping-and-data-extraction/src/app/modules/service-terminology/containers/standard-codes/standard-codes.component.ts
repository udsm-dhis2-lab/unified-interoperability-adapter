import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ServicesTerminologyServiceService } from '../../services/services-terminology-service.service';

@Component({
  selector: 'app-standard-codes',
  templateUrl: './standard-codes.component.html',
  styleUrls: ['./standard-codes.component.css'],
  standalone: true,
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class StandardCodesComponent implements OnInit {
  @Output() codeAdded = new EventEmitter<void>();
  standardCodeForm!: FormGroup;

  isSubmitting: boolean = false;

  alert = {
    show: false,
    type: 'success' as 'success' | 'info' | 'error' | 'warning',
    message: '',
  };

  standardCodeCategory: { key: string; name: string }[] = [
    { key: 'ICD-CODES', name: 'ICD' },
    { key: 'LOINC', name: 'LOINC' }
  ];

  constructor(private fb: FormBuilder, private serviceTerminologyService: ServicesTerminologyServiceService) { }

  ngOnInit(): void {
    this.standardCodeForm = this.fb.group({
      codeType: [null, [Validators.required]],
      code: [null, [Validators.required]],
      displayName: [null, [Validators.required]],
      key: [null, [Validators.required]],
    });
  }

  get standardCodeType() {
    return this.standardCodeForm.get('codeType');
  }
  get code() {
    return this.standardCodeForm.get('code');
  }
  get displayName() {
    return this.standardCodeForm.get('displayName');
  }

  get key() {
    return this.standardCodeForm.get('key');
  }

  submitForm(): void {
    this.isSubmitting = true;
    if (this.standardCodeForm.valid) {
      var standardCode = {
        namespace: this.standardCodeType?.value,
        value: {
          code: this.code?.value,
          name: this.displayName?.value,
        },
        dataKey: this.key?.value,
      };

      try {
        const response = this.serviceTerminologyService.saveServiceCode(standardCode).subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.clearForm();
            this.showAlert('success', 'Standard code saved successfully');
            this.codeAdded.emit(); 
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.clearForm();
            this.showAlert('error', 'Failed to save standard code');
          }
        });
      } catch (error) {
        this.isSubmitting = false;
        this.clearForm();
        this.showAlert('error', error as string);
      }
    } else {
      this.isSubmitting = false;
      Object.values(this.standardCodeForm.controls).forEach(control => {
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
    this.standardCodeForm.reset();
  }
}
