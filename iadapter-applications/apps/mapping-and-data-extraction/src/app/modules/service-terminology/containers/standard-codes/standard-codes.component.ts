import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

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
  standardCodeForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.standardCodeForm = this.fb.group({
      codeType: [null, [Validators.required]],
      code: [null, [Validators.required]],
      displayName: [null, [Validators.required]]
    });
  }

  submitForm(): void {
    if (this.standardCodeForm.valid) {
      console.log('submit', this.standardCodeForm.value);
    } else {
      Object.values(this.standardCodeForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
