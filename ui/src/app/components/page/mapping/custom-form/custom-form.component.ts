import { UiService } from 'src/app/services/ui.service';
import { PeriodFilter } from './../../../../Helpers/period-filter';
import { DataValueFetchService } from './../../../../services/dataValueFetch/data-value-fetch.service';
import {
  DataValueFetchInterface,
} from './../../../../resources/interfaces';
import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { onFormReady, onDataValueChange } from 'src/app/Helpers/form.helper';
import { AddQueryComponent } from './add-query/add-query.component';
import { MatDialog } from '@angular/material/dialog';
import { first } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatasetInterface, SourceInterface } from 'src/app/models/source.model';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css'],
})
export class CustomFormComponent implements OnInit, AfterViewInit {
  @Input() presetValuesSections: any;
  @Input() dataSetFormDesign: any;
  @Input() dataSetDataValues: any;

  @Input() isDataEntryLevel: any;

  @Input() entryFormType: string;

  @Input() sources: SourceInterface[] | undefined;
  @Input() dataset: DatasetInterface | undefined;

  @Output() dataValueUpdate: EventEmitter<any> = new EventEmitter<any>();

  _htmlMarkup: SafeHtml | undefined;
  hasScriptSet: boolean | undefined;
  entryFormStatusColors: any;
  source: SourceInterface | undefined;
  query: string | undefined;
  dataValueFetchs: DataValueFetchInterface[] | undefined;
  dataValueFetch: any;
  period: any;

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
  /**
   * End of period filter
   */

  constructor(
    private dataValueFetchService: DataValueFetchService,
    private uiServices: UiService,
    private sanitizer?: DomSanitizer,
    private elementRef?: ElementRef,
    public dialog?: MatDialog,
    private router?: Router,
    private route?: ActivatedRoute,
    private periodFilter?: PeriodFilter
  ) {

    this.entryFormStatusColors = {
      OK: '#b9ffb9',
      WAIT: '#fffe8c',
      ERROR: '#ff8a8a',
      ACTIVE: '#488aff',
      NORMAL: '#ccc',
    };

    this.entryFormType = 'aggregate';

   
  }

  ngOnInit() {
    try {
      this._htmlMarkup = this.sanitizer?.bypassSecurityTrustHtml(
        this.dataSetFormDesign
      );
    } catch (e) {
      // console.log(JSON.stringify(e));
    }
  }

  ngAfterViewInit() {
    this.setScriptsOnHtmlContent(
      this.getScriptsContents(this.dataSetFormDesign)
    );

  }

  getScriptsContents(html: any) {
    if (html) {
      const matchedScriptArray = html.match(
        /<script[^>]*>([\w|\W]*)<\/script>/im
      );
      const scripts =
        matchedScriptArray && matchedScriptArray.length > 0
          ? matchedScriptArray[0]
              .replace(/(<([^>]+)>)/gi, ':separator:')
              .split(':separator:')
              .filter((content: any) => content.length > 0)
          : [];

      return _.filter(scripts, (scriptContent: string) => scriptContent !== '');
    }
    return undefined;
  }

  setScriptsOnHtmlContent(scriptsContentsArray: any) {
    const dataElements = _.flatten(
      _.map(
        this.presetValuesSections,
        (presetValuesSection: any) => presetValuesSection.dataElements
      )
    );

    if (!this.hasScriptSet) {
      onFormReady(
        this.entryFormType,
        dataElements,
        this.dataSetDataValues,
        this.entryFormStatusColors,
        this.isDataEntryLevel,
        scriptsContentsArray,
        false,
        this.getEnabledInputTagsOnHtmlContent()
      );
    }
  }

  

  getEnabledInputTagsOnHtmlContent() {
    // this.uiServices.clickEvent().pipe().subscribe((event) => {
    //   if(event){
    //     event.stopPropagation();
    //     console.log("Event in Popup: ", event)
    //     this.eventPopupListener(event);
    //   }
    // });
    document.getElementsByName('entryfield').forEach((element)=>{
        if(element){
          element.addEventListener('click', (event) => {
            this.eventPopupListener(event)
          })
        }
    });


  }

  eventPopupListener = (event: any) => {
    if (event.target.name === 'entryfield') {
      console.log(event)
      if(!this.dialogOpened){
        this?.openDialog(this.sources!, event.target.id);
        this.dialogOpened = true;
      }
    }
  };

  async openDialog(
    sourcesToChoose: SourceInterface[],
    elementId: string
  ): Promise<any> {
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
        // console.log('Data Value Fetching 1: ', this.dataValueFetch);
      });

    await new Promise((resolve) => setTimeout(resolve, 500));

    // console.log('Data Value Fetching 2: ', this.dataValueFetch);

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

    // console.log("Opened: "+ this.dataValueFetch);

    dialogRef?.afterClosed().subscribe((result) => {
      this.dialogOpened = false;
      if (result) {
        this.source = result.source;
        this.query = result.query;
        // console.log("Source: "+this.source?.type + " Query:" + this.query + ' Dataset: ' + this.dataset?.displayName+ ' Element ID: ' + result.elementId)
        this.addDataValueFetch(
          this.source?.id,
          this.query,
          this.dataset?.id,
          result.elementId,
          result.id
        );
      } else {
        console.log('No data found');
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
      .subscribe((dataValueFetch) =>
        this.dataValueFetchs?.push(dataValueFetch)
      );
  }
}
