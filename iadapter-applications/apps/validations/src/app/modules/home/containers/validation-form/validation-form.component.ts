import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Import Ng-Zorro modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-validation-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, NzFormModule,
    NzInputModule, NzButtonModule, NzLayoutModule, NzBreadCrumbModule, NzGridModule
  ],
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.scss']
})
export class ValidationFormComponent implements OnInit {
  validationForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validationForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      message: ['', [Validators.required]],
      code: ['', [Validators.required]],
      ruleExpression: ['', [Validators.required]]
    });
  }

  saveForm(): void {
    if (this.validationForm.valid) {
      console.log('Form Submitted!', this.validationForm.value);
      // In a real app, you would send this to a service
      this.router.navigate(['/validations']);
    } else {
      // Mark all fields as touched to show validation errors
      Object.values(this.validationForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/validations']);
  }
}
