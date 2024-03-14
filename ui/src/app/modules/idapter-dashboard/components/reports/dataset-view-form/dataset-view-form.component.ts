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

import { ReportsService } from 'src/app/services/reports/reports.service';
import { UiService } from 'src/app/services/ui.service';
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  EventEmitter,
  Output,
} from '@angular/core';
import * as _ from 'lodash';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { onFormReady, onDataValueChange } from 'src/app/Helpers/form.helper';
import { MatDialog } from '@angular/material/dialog';
import { DatasetInterface, SourceInterface } from 'src/app/models/source.model';
import { DataValueFetchInterface } from 'src/app/resources/interfaces';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-dataset-view-form',
  templateUrl: './dataset-view-form.component.html',
  styleUrls: ['./dataset-view-form.component.css'],
})
export class DatasetViewFormComponent implements OnInit, AfterViewInit {
  @Input() presetValuesSections: any;
  @Input() dataSetFormDesign: any;
  @Input() dataSetDataValues: any;

  @Input() isDataEntryLevel: any;

  @Input() entryFormType: string;
  @Input() dataset: DatasetInterface | undefined;
  @Input() datasetValues: any[] | undefined;

  @Output() dataValueUpdate: EventEmitter<any> = new EventEmitter<any>();
  @Output() valueSentToDHIS2: EventEmitter<any> = new EventEmitter<any>();

  @Input() payloadToSend: any;

  _htmlMarkup: SafeHtml | undefined;
  hasScriptSet: boolean | undefined;
  entryFormStatusColors: any;
  source: SourceInterface | undefined;
  query: string | undefined;
  dataValueFetchs: DataValueFetchInterface[] | undefined;
  dataValueFetch: any;
  sendingData: boolean = false;
  sendingDataResponse$: Observable<any> | undefined = of([]);
  constructor(
    private uiService: UiService,
    private reportService: ReportsService,
    private sanitizer?: DomSanitizer,
    public dialog?: MatDialog
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

      const iframe = document.createElement('iframe');
      iframe.style.border = 'none';
      iframe.style.width = '100%';
      iframe.style.minHeight = '100vh';
      iframe.setAttribute('id', 'iframe_id');
      iframe.setAttribute(
        'onload',
        'this.height=this.contentWindow.document.body.scrollHeight;'
      );
      setTimeout(() => {
        const ctnr = document.getElementById('html_dataset_report_id');
        if (ctnr) {
          ctnr.appendChild(iframe);
          iframe.contentWindow?.document.open('text/htmlreplace');
          iframe.contentWindow?.document.write(this.dataSetFormDesign);
          iframe.contentWindow?.document.close();
        }
      }, 50);
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
        this.datasetValues,
        this.entryFormStatusColors,
        this.isDataEntryLevel,
        scriptsContentsArray,
        true,
        () => {}
      );
    }
  }

  sendReport(event: Event): void {
    event.stopPropagation();
    this.sendingData = true;
    this.sendingDataResponse$ = this.reportService.sendReport(
      this.payloadToSend
    );

    this.sendingDataResponse$.subscribe((response) => {
      if (response) {
        this.sendingData = false;
        this.valueSentToDHIS2.emit(response);
      }
    });
  }

  onDownloadToExcel(event: Event, id: string): void {
    event.stopPropagation();
    const fileName = 'Report_';
    event.stopPropagation();
    const htmlTable = document.getElementById(id)?.outerHTML;
    // const htmlTable = window.document.getElementById(id).outerHTML;
    if (htmlTable) {
      const uri = 'data:application/vnd.ms-excel;base64,',
        template =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:' +
          'office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
          '<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
          '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
          '</head><body><table border="1">{table}</table><br /><table border="1">{table}</table></body></html>',
        base64 = (s: any) => window.btoa(unescape(encodeURIComponent(s))),
        format = (s: any, c: any) =>
          s.replace(/{(\w+)}/g, (m: any, p: any) => c[p]);

      const ctx = { worksheet: 'Data', filename: fileName };
      let str =
        '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office' +
        ':excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook>' +
        '<x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/>' +
        '</x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>';
      // ctx['div'] = htmlTable;

      str += htmlTable + '</body></html>';
      const link = document.createElement('a');
      link.download = fileName + '.xls';
      link.href = uri + base64(format(str, ctx));
      link.click();
    }
  }
}
