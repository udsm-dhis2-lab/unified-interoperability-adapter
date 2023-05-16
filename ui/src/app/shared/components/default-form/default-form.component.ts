import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SourceInterface } from 'src/app/models/source.model';
import { AddQueryComponent } from 'src/app/modules/idapter-dashboard/components/mapping/custom-form/add-query/add-query.component';
import { DataValueFetchInterface } from 'src/app/resources/interfaces';
import { DataValueFetchService } from 'src/app/services/dataValueFetch/data-value-fetch.service';

@Component({
  selector: 'app-default-form',
  templateUrl: './default-form.component.html',
  styleUrls: ['./default-form.component.css'],
})
export class DefaultFormComponent implements OnInit {
  @Input() dataset: any | undefined;
  @Input() datasources: SourceInterface[] | undefined;
  dataElementsDetails: any = {};

  source: SourceInterface | undefined;
  query: string | undefined;
  dataValueFetchs: DataValueFetchInterface[] | undefined;
  dataValueFetch: any;
  period: any;
  message: string | undefined;
  messageType: string | undefined;

  /**For period filter */
  periodObject: any;
  periodFilterConfig: any = {
    singleSelection: true,
    emitOnSelection: true,
    childrenPeriodSortOrder: 'ASC',
    allowDateRangeSelection: true,
    allowRelativePeriodSelection: true,
    allowFixedPeriodSelection: true,
    hideActionButtons: true,
    contentHeight: '300px',
  };
  selectedPeriodItems: any[] = [];
  dialogOpened: boolean = false;
  constructor(
    private dialog: MatDialog,
    private dataValueFetchService: DataValueFetchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.dataset);
    this.dataElementsDetails =
      this.dataset?.datasetFields?.dataSetElements?.map(
        (datasetElement: any) => {
          return datasetElement?.dataElement;
        }
      );
  }

  onOpenDialog(
    datasources: SourceInterface[] | undefined,
    id: string | undefined
  ): void {
    this.openDialog(datasources, id);
  }

  async openDialog(
    sourcesToChoose: SourceInterface[] | undefined,
    elementId: string | undefined
  ) {
    const dataValueFetchObject = {
      dataElementCategoryOptionCombo: elementId,
      sqlQuery: undefined,
      datasets: {
        id: this?.dataset?.id,
      },
      datasource: {
        id: undefined,
      },
    };

    this?.dataValueFetchService
      .getSingleDataValueFetch(dataValueFetchObject)
      .subscribe((dataValueFetch) => {
        this.dataValueFetch = dataValueFetch;
      });

    await new Promise((resolve) => setTimeout(resolve, 500));
    const dialogRef = this.dialog?.open(AddQueryComponent, {
      autoFocus: true,
      width: '50%',
      data: {
        sources: sourcesToChoose,
        query: this.dataValueFetch?.sqlQuery,
        source: this.dataValueFetch?.datasource,
        elementId: elementId,
        id: this.dataValueFetch?.id,
        dataset: this.dataset,
      },
    });

    dialogRef?.afterClosed().subscribe((result) => {
      this.dialogOpened = false;
      if (result) {
        this.source = result.source;
        this.query = result.query;
        this.addDataValueFetch(
          this.source?.id,
          this.query,
          this.dataset?.id,
          result.elementId,
          result.id
        );
      } else {
        this.source = undefined;
        this.query = undefined;
      }

      // document.addEventListener('click', ()=>{});
      //  document.removeEventListener('click', this.eventPopupListener);

      this.router!.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router!.onSameUrlNavigation = 'reload';
      // this.router!.navigate(['/'], {
      //   relativeTo: this.route
      // })
    });
  }

  addDataValueFetch(
    dataSource?: number,
    query?: string,
    dataset?: string,
    elementCombo?: string,
    id?: any
  ) {
    const dataValueFetchObject = {
      id: id,
      dataElementCategoryOptionCombo: elementCombo,
      sqlQuery: query,
      datasets: {
        id: dataset,
      },
      datasource: {
        id: dataSource,
      },
    };
    this.dataValueFetchService
      .addDataValueFetch(dataValueFetchObject)
      .subscribe({
        next: (dataValueFetch) => {
          this.dataValueFetchs?.push(dataValueFetch);
          this.message = 'Query saved successfully.';
          this.messageType = 'success';
        },
        error: (dataValueFetch) => {
          this.message = dataValueFetch.error.message;
          this.messageType = 'danger';
        },
      });

    this.message = undefined;
    this.messageType = undefined;
  }
}
