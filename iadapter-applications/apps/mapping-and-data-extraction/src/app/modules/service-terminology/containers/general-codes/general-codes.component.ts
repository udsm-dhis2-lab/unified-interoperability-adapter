import { Component, OnInit } from '@angular/core';
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
  generalCodeForm!: FormGroup;
  isSubmitting: boolean = false;

  alert = {
    show: false,
    type: '',
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
      console.log('Form is valid');
      var generalCode = {
        namespace: this.generalCodeForm.get('generalCodeType')?.value,
        value: {
          code: this.generalCodeForm.get('code')?.value,
          name: this.generalCodeForm.get('name')?.value
        },
        dataKey: this.generalCodeForm.get('key')?.value,
        datastoreGroup: ServiceTerminologyConstants.GENERAL_CODE_GROUP
      };

      try {
        const response = this.serviceTerminologyService.saveGeneralCodes(generalCode).subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.clearForm();
            this.alert = {
              show: true,
              type: 'success',
              message: 'General code was added successfully',
            };
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.clearForm();
            this.alert = {
              show: true,
              type: 'error',
              message: error,
            };
          }
        });
      } catch (error) {
        this.isSubmitting = false;
        this.clearForm();
        this.alert = {
          show: true,
          type: 'error',
          message: error as string,
        };
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

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }

  clearForm() {
    this.generalCodeForm.reset();
  }
}