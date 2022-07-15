import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private showAddSourceForm: boolean = false;
  private showAddInstanceForm: boolean = false;
  private showAddDatasetForm: boolean = false;
  private subject = new Subject<any>();

  constructor() {}

  toggleAddForm(): void {
   this.showAddSourceForm = !this.showAddSourceForm;
   this.subject.next(this.showAddSourceForm);
  }

  onToggleAddForm(): Observable<any> {
    return this.subject.asObservable();
  }

  toggleAddInstanceForm(): void {
   this.showAddInstanceForm = !this.showAddInstanceForm;
   this.subject.next(this.showAddInstanceForm);
  }

  onToggleAddInstanceForm(): Observable<any> {
    return this.subject.asObservable();
  }
 
  toggleAddDatasetForm(): void {
   this.showAddDatasetForm = !this.showAddDatasetForm;
   this.subject.next(this.showAddDatasetForm);
  }

  onToggleAddDatasetForm(): Observable<any> {
    return this.subject.asObservable();
  }
}

