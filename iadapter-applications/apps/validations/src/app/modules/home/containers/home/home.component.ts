import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Shared and Ng-Zorro Modules
import { SharedModule } from 'apps/validations/src/app/shared/shared.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal'; // For delete confirmation
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message'; // For feedback
import { NzDividerModule } from 'ng-zorro-antd/divider';

// Import your service and models
import {
  Validation,
  ValidationPage,
  ValidationService,
} from '../../services/client-management.service';

@Component({
  standalone: true,
  selector: 'home-component',
  imports: [
    CommonModule,
    SharedModule,
    NzDividerModule,
    RouterModule,
    FormsModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzIconModule,
    NzAlertModule,
    NzModalModule, // Add NzModalModule
    NzMessageModule, // Add NzMessageModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  // Data, loading, and error state
  listOfData: Validation[] = [];
  isLoading = true; // Start with loading true
  error: string | null = null;

  // Pagination
  pageIndex = 1;
  pageSize = 10;
  totalItems = 0;

  // --- 1. Search and Filtering state ---
  searchValue = '';
  private searchSubject = new Subject<string>();
  private searchSubscription?: Subscription;

  columnWidths = {
    name: '10%',
    description: '25%',
    message: '25%',
    code: '10%',
    expression: '20%',
    action: '5%',
  };

  // --- 2. Inject Modal and Message services ---
  constructor(
    private router: Router,
    private validationService: ValidationService,
    private modal: NzModalService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadValidations();
  }

  // --- 3. Set up debounced search to prevent API spam ---
  private setupSearchDebounce(): void {
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500), // Wait for 500ms of silence
        distinctUntilChanged() // Only emit if the value has changed
      )
      .subscribe(() => {
        this.pageIndex = 1; // Reset to the first page on search
        this.loadValidations();
      });
  }

  loadValidations(): void {
    this.isLoading = true;
    this.error = null;

    const apiPageIndex = this.pageIndex - 1;

    // --- 4. Build filter array for the API call ---
    // Assuming your API can filter by a 'name' field with a 'CONTAINS' operation
    const filters = [];
    if (this.searchValue) {
      filters.push({
        key: 'name',
        value: this.searchValue,
        operation: 'CONTAINS',
      });
    }

    this.validationService
      .getValidations(apiPageIndex, this.pageSize, filters as any)
      .subscribe({
        next: (response: ValidationPage) => {
          this.listOfData = response.results;
          this.totalItems = response.totalElements;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error('Failed to load validation rules:', err);
          this.error =
            'Could not retrieve validation rules. Please try again later.';
          this.isLoading = false;
        },
      });
  }

  // Trigger search when user types
  onSearch(): void {
    console.log('search value here>');
    this.searchSubject.next(this.searchValue.trim());
  }

  // Handle table pagination events
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadValidations();
  }

  // Handle page size change if you add a size changer to your table
  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.pageIndex = 1; // Reset to first page
    this.loadValidations();
  }

  addNewValidation(): void {
    // Navigate to the form for creating a new validation
    this.router.navigate(['/validations/validations/new']);
  }

  editValidation(id: string | undefined): void {
    console.log('edit validations');
    if (!id) return;
    // Navigate to the form in edit mode, passing the validation's ID
    this.router.navigate(['/validations/validations/edit', id]);
  }

  // --- 5. Implement delete with a confirmation dialog ---
  deleteValidation(validation: Validation): void {
    if (!validation.uuid) return;

    this.modal.confirm({
      nzTitle: 'Are you sure you want to delete this validation?',
      nzContent: `<p>You are about to delete the rule: <strong>${validation.name}</strong></p><p>This action cannot be undone.</p>`,
      nzOkText: 'Yes, Delete',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'Cancel',
      nzOnOk: () => {
        // Here you would call the actual delete service method
        // this.validationService.deleteValidation(validation.id).subscribe({ ... });
        this.message.success(
          `Validation rule "${validation.name}" deleted successfully.`
        );
        // For demonstration, we'll just remove it from the list and reload
        this.loadValidations();
      },
    });
  }

  // --- 6. Clean up subscriptions ---
  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
