import { Component, OnInit } from '@angular/core';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import { SourcesService } from 'src/app/services/sources/sources.service';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { EditSourceComponent } from './edit-source/edit-source.component';
import { MatDialog } from '@angular/material/dialog';
import { SourceInterface } from 'src/app/models/source.model';

@Component({
  selector: 'app-sources',
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.css'],
})
export class SourcesComponent implements OnInit {
  sources: SourceInterface[] | undefined;
  source: SourceInterface | undefined;
  showAddSourceForm: boolean = false;
  subscription: Subscription | undefined;
  message: string | undefined;
  messageType: string | undefined;

  faEdit = faEdit;
  faTrash = faTrash;

  constructor(
    private sourcesService: SourcesService,
    private uiService?: UiService,
    private router?: Router,
    public dialog?: MatDialog
  ) {
    this.subscription = this.uiService
      ?.onToggleAddForm()
      .subscribe((value) => (this.showAddSourceForm = value));
  }

  ngOnInit(): void {
    this.sourcesService
      .getSources()
      .subscribe((sources) => (this.sources = sources));
  }

  onToggle() {
    this.uiService?.toggleAddForm();
  }

  onDelete(source: SourceInterface) {
    this.sourcesService
      .deleteSource(source)
      .subscribe({
        next: () => {
          this.sources = this.sources?.filter((s) => s.id !== source.id);
          this.message = 'Source deleted successfully.';
          this.messageType = 'success';
        },
        error: (error) => {
          this.message = "Couldn't delete the source."
          console.log(error.error.message);
          this.messageType = 'danger';
        }
      });
    this.router?.navigate(['/sources']);
    this.message = undefined;
    this.messageType = undefined;
  }

  // activateSource(source: SourceInterface) {
  //   source.active = !source.active;
  //   this.sourcesService.updateSourceActivate(source).subscribe();
  // }

  addSource(source: SourceInterface) {
    this.sourcesService
      .addSource(source)
      .subscribe({
        next: (source) => {
          this.sources?.push(source)
        },
        error: (error) => {
        this.message = error.error.message
        this.messageType = "danger"
        }
      });
  }

  openDialog(sourceToEdit: SourceInterface): void {
    const dialogRef = this.dialog?.open(EditSourceComponent, {
      width: '50%',
      data: sourceToEdit,
    });

    console.log('Opened: ' + sourceToEdit.type);

    dialogRef?.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Results: ', result);
        this.source = result;
        this.sourcesService.updateSourceActivate(this.source!).subscribe({
          next: () => {
            this.router?.navigate(['/sources']);
            this.message = 'Source added successfully.';
            this.messageType = 'success';
          },
          error: (error) => {
            this.message = error.error.message;
            this.messageType = 'danger';
          }
        });
      } else {
        window.location.reload();
      }
    });
    this.message = undefined;
    this.messageType = undefined;
  }
}
