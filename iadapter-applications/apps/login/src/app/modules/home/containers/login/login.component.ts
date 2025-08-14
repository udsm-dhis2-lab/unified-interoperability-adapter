import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { antDesignModules } from '../../../../shared/ant-design-modules';
import { LoginService } from '../../services/login.service';

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
export class LoginComponent implements OnDestroy, AfterViewInit, OnInit {
  isLoading = false;
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
    private fb: NonNullableFormBuilder,
    private loginService: LoginService,
    private zone: NgZone
  ) {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.loginSubcription) {
      this.loginSubcription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 0);
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const { userName, password } = this.validateForm.value;
      if (userName && password) {
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
          this.isLoading = false;
          this.alert = {
            show: true,
            type: 'success',
            message: 'Login Successful',
          };
          window.open('../../../apps', '_self');
        },
        error: (error) => {
          this.isLoading = false;
          this.alert = {
            show: true,
            type: 'error',
            message: error.message,
          };
        },
      });
  }

  onCloseAlert() {
    this.alert = {
      show: false,
      type: '',
      message: '',
    };
  }
}
