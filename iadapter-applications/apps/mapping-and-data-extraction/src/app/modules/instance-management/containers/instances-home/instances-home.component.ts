import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'apps/mapping-and-data-extraction/src/app/shared/shared.module';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-instances-home',
  standalone: true,
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  templateUrl: './instances-home.component.html',
  styleUrl: './instances-home.component.css',
})
export class InstancesHomeComponent implements OnInit {
  instanceForm!: FormGroup;
  isSubmitting: boolean = false;
  isDrawerVisible: boolean = false;

  // Paging info
  pageIndex: number = 1;
  constructor(private fb: NonNullableFormBuilder) {
    this.instanceForm = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      code: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  ngOnInit(): void {}

  onOpenSideDrawer(event: Event): void {
    event.stopPropagation();
    this.isDrawerVisible = true;
  }

  onCloseSideDrawer(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.isDrawerVisible = false;
  }

  onSubmit(event: Event) {
    event.stopPropagation();
  }
}
