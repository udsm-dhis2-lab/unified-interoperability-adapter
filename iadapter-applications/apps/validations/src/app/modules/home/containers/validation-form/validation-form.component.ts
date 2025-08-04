import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

// Import Ng-Zorro and other required modules
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzRadioModule } from 'ng-zorro-antd/radio'; // <-- ADD THIS

// Import your custom components and services
import { RuleBuilderComponent } from '../rule-builder/rule-builder.component';
import { ValidationRule } from '../../models/validation.model';
import { ValidationService } from '../../services/client-management.service';
// import { ValidationService } from '../services/validation.service'; // Adjust path as needed
// import validationForm{ ValidationRule } from '../models/validation.model'; // Adjust path as needed

@Component({
  selector: 'app-validation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzMessageModule,
    NzSpinModule,
    RuleBuilderComponent,
    NzRadioModule,
    FormsModule,
  ],
  templateUrl: './validation-form.component.html',
  styleUrls: ['./validation-form.component.css'],
})
export class ValidationFormComponent implements OnInit {
  validationForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  private validationId?: string;

  public ruleInputMode: 'builder' | 'editor' = 'editor';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private validationService: ValidationService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.checkModeAndLoadData();
  }

  private initForm(): void {
    this.validationForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      message: ['', [Validators.required]], // Corresponds to `errorMessage` in the API
      code: ['', [Validators.required]],
      ruleExpression: [null, [Validators.required]], // `null` is often a better default for custom controls
    });
  }

  private checkModeAndLoadData(): void {
    // Check for an 'id' parameter in the URL
    this.validationId = this.route.snapshot.paramMap.get('id') || undefined;

    if (this.validationId) {
      this.isEditMode = true;
      this.isLoading = true;
      this.validationService
        .getValidationById(this.validationId)
        .pipe(finalize(() => (this.isLoading = false)))
        .subscribe({
          next: (validationData: any) => {
            this.patchForm(validationData);
            this.messageService.info('Loaded existing validation rule.');
          },
          error: (err: any) => {
            console.error('Failed to load validation data:', err);
            this.messageService.error(
              'Could not load validation rule. Please try again.'
            );
            this.router.navigate(['/validations']);
          },
        });
    }
  }

  onRuleExpressionChange(expression: string): void {
    this.validationForm.get('ruleExpression')?.setValue(expression);
    // Optional: Mark as dirty to reflect user interaction
    this.validationForm.get('ruleExpression')?.markAsDirty();
  }

  private patchForm(validation: ValidationRule): void {
    this.validationForm.patchValue({
      name: validation.name,
      description: validation.description,
      message: validation.errorMessage, // Map API `errorMessage` to form `message`
      code: validation.code,
      ruleExpression: [null, [Validators.required]],
    });
  }

  saveForm(): void {
    if (this.validationForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.values(this.validationForm.controls).forEach((control) => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      this.messageService.warning('Please fill out all required fields.');
      return;
    }

    this.isLoading = true;

    const formValue = this.validationForm.value;

    // Construct the payload to match the API specification
    const payload: Omit<ValidationRule, 'id'> = {
      name: formValue.name,
      description: formValue.description,
      errorMessage: formValue.message, // Map form `message` to API `errorMessage`
      code: formValue.code,
      ruleExpression: formValue.ruleExpression,
    };

    console.log('Payload:', payload);

    const saveOperation =
      this.isEditMode && this.validationId
        ? this.validationService.updateValidation(this.validationId, payload)
        : this.validationService.createValidation(payload);

    saveOperation.pipe(finalize(() => (this.isLoading = false))).subscribe({
      next: () => {
        const action = this.isEditMode ? 'updated' : 'created';
        this.messageService.success(`Validation rule successfully ${action}.`);
        this.router.navigate(['/validations']);
      },
      error: (err: any) => {
        console.error('Failed to save validation:', err);
        const action = this.isEditMode ? 'update' : 'create';
        this.messageService.error(`Failed to ${action} the validation rule.`);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/validations']);
  }
}
