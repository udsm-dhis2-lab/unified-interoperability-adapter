import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { antDesignModules } from 'apps/login/src/app/shared/ant-design-modules';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...antDesignModules,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnDestroy {
  isLoading: boolean = false;
  alert = {
    show: false,
    type: '',
    message: '',
  };

  validateForm: FormGroup<{
    userName: FormControl<string>;
    password: FormControl<string>;
  }>;
  loginSubcription!: Subscription;
  constructor(
    @Inject(NonNullableFormBuilder) private fb: NonNullableFormBuilder,
    private loginService: LoginService
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnDestroy(): void {
    if (this.loginSubcription) {
      this.loginSubcription.unsubscribe();
    }
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, password } = this.validateForm.value;
      if (userName && password) {
        console.log('login credentials', userName, password);
        this.login(userName, password);
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  login(userName: string, password: string): void {
    this.isLoading = true;
    this.loginSubcription = this.loginService
      .login(userName, password)
      .subscribe({
        next: (response: any) => {
          console.log('login successful');
          this.isLoading = false;
          this.alert = {
            show: true,
            type: 'success',
            message: 'Login Successful',
          };
        },
        error: (error) => {
          console.log('login unsuccessful', error);
          this.isLoading = false;
          this.alert = {
            show: true,
            type: 'error',
            message: error.message,
          };
        },
      });
  }

  afterClose() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
