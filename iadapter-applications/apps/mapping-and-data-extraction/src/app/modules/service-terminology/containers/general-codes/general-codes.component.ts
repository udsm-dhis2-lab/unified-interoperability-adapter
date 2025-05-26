import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { group } from 'console';
import { ServiceTerminologyConstants } from '../../models/constants/service-terminology-constants';


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

  generalCodeCategory: { key: string; name: string }[] = [
    { key: 'billings', name: 'Billings' },
    { key: 'insurances', name: 'Insurances' }
  ];


  constructor(private fb: FormBuilder) { }

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

  submitForm(): void {
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

      console.log(this.generalCodeForm.value);
    } else {
      Object.values(this.generalCodeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      console.log('Form is invalid');
    }
  }
}