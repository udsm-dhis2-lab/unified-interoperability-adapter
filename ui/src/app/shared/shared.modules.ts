import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    DragDropModule,
  ],
  exports: [
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatSelectModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    DragDropModule,
  ],
})
export class SharedModule {}
