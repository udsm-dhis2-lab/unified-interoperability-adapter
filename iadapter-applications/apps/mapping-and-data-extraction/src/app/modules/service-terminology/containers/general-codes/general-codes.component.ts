import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';


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

  submitForm(): void {
    if (this.generalCodeForm.valid) {
      console.log('Form Submitted!', this.generalCodeForm.value);
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