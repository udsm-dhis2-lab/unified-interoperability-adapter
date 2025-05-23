import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import Reactive Forms modules
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
export class GeneralCodesComponent implements OnInit { // Implement OnInit
  generalCodeForm!: FormGroup; // Declare the FormGroup

  generalCodeCategory: { key: string; name: string }[] = [
    { key: 'billings', name: 'Billings' },
    { key: 'insurances', name: 'Insurances' },
    { key: 'departments', name: 'Departments' }, // Added another for example
  ];

  // selectedGeneralCodeCategory is no longer needed here as the form will handle it

  constructor(private fb: FormBuilder) { } // Inject FormBuilder

  ngOnInit(): void {
    this.generalCodeForm = this.fb.group({
      generalCodeType: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.maxLength(50)]], // Example: required and max length
      name: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  // Helper getters for easier access in the template
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
      // Here you would typically send the data to a service
      // this.generalCodeForm.reset(); // Optionally reset form after submission
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