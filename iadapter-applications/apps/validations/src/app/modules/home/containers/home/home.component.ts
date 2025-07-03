import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'apps/validations/src/app/shared/shared.module';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf

// --- 1. Import your service and models ---

// Import necessary Ng-Zorro modules
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzAlertModule } from 'ng-zorro-antd/alert'; // Import for displaying errors
import { Validation, ValidationPage, ValidationService } from '../../services/client-management.service';


// The 'Validation' interface from the service can replace the local 'ValidationRule'
// export interface ValidationRule { ... } // This is no longer needed

@Component({
  standalone: true,
  selector: 'home-component',
  imports: [
    CommonModule, // Add CommonModule for directives like *ngIf
    SharedModule, RouterModule, FormsModule, NzLayoutModule, NzBreadCrumbModule,
    NzGridModule, NzButtonModule, NzTableModule, NzInputModule, NzIconModule,
    NzAlertModule // Add NzAlertModule to imports
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  // --- 2. Define properties for data, loading, and pagination state ---
  listOfData: Validation[] = []; // Use the 'Validation' interface from the service
  isLoading = false;
  error: string | null = null;

  // Pagination
  pageIndex = 1; // NzTable pagination is 1-based
  pageSize = 10;
  totalItems = 0;

  // Keeping your column width definitions
  columnWidths = {
    name: '10%',
    description: '25%',
    message: '25%',
    code: '10%',
    expression: '20%',
    action: '5%'
  };

  // --- 3. Inject the ValidationService along with the Router ---
  constructor(
    private router: Router,
    private validationService: ValidationService
  ) {}

  ngOnInit(): void {
    // --- 4. Call the method to load data when the component initializes ---
    this.loadValidations();
  }

  // --- 5. Create a method to encapsulate the data fetching logic ---
  loadValidations(): void {
    this.isLoading = true;
    this.error = null;

    // Adjust pageIndex for 0-based APIs if necessary. Assuming API is 0-based.
    const apiPageIndex = this.pageIndex - 1;

    // We pass an empty array for filters for now
    this.validationService.getValidations(apiPageIndex, this.pageSize, []).subscribe({
      next: (response: ValidationPage) => {
        this.listOfData = response.content;
        this.totalItems = response.totalElements;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Failed to load validation rules:', err);
        this.error = err.message; // Use the user-friendly error from the service
        this.isLoading = false;
      }
    });
  }

  // --- 6. Add a handler for table pagination events ---
  onPageIndexChange(index: number): void {
    this.pageIndex = index;
    this.loadValidations();
  }

  addNewValidation(): void {
   this.router.navigate(['/validations/validations/new']);
  }

  // Methods for Edit/Delete actions (can be implemented later)
  editValidation(id: string | undefined): void {
    if (!id) return;
    console.log('Editing validation with ID:', id);
    // this.router.navigate(['/validations/edit', id]);
  }

  deleteValidation(id: string | undefined): void {
    if (!id) return;
    console.log('Deleting validation with ID:', id);
    // Add confirmation modal logic here
    // this.validationService.deleteValidation(id).subscribe(() => { ... });
  }
}
