import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-instances-home',
  templateUrl: './instances-home.component.html',
  styleUrl: './instances-home.component.css',
})
export class InstancesHomeComponent implements OnInit {
  instanceForm!: FormGroup;
  isSubmitting!: boolean;

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

  onSubmit(): void {}
}
