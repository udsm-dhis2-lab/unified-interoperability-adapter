/* BSD 3-Clause License

Copyright (c) 2022, UDSM DHIS2 Lab Tanzania.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { UiService } from 'src/app/services/ui.service';
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
import { DataValueFetchInterface } from 'src/app/resources/interfaces';
import { DataValueFetchService } from 'src/app/services/dataValueFetch/data-value-fetch.service';
import { PeriodFilter } from 'src/app/Helpers/period-filter';

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
    } catch (e) {}
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
    //     this.eventPopupListener(event);
    //   }
    // });
    let dataRows = [];
    document
      .querySelectorAll('tr')
      .forEach((tr: HTMLTableRowElement, index: number) => {
        // console.log(tr);
        let dataRow = {};
        let cells: any[] = [];
        tr.querySelectorAll('td').forEach(
          (td: HTMLTableCellElement, cellIndex: number) => {
            let cellData: any = {};
            // console.log(td.children[0]);

            cellData['index'] = cellIndex;
            cellData['id'] = td.children[0]
              ? td.children[0].getAttribute('id')
              : '';
            cells.push(cellData);
          }
        );

        dataRow['index'] = index;
        dataRow['cells'] = cells;
        dataRows.push(dataRow);
        console.log(dataRows);
      });
    document.getElementsByName('entryfield').forEach((element) => {
      if (element) {
        element.addEventListener('click', (event) => {
          this.eventPopupListener(event);
        });
      }
    });
  }

  eventPopupListener = (event: any) => {
    if (event.target.name === 'entryfield') {
      if (!this.dialogOpened) {
        this?.openDialog(this.sources!, event.target.id);
        this.dialogOpened = true;
      }
    }
  };

  async openDialog(sourcesToChoose: SourceInterface[], elementId: string) {
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
