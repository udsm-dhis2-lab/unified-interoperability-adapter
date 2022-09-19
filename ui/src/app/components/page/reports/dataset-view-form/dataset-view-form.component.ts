import { ReportsService } from 'src/app/services/reports/reports.service';
import { UiService } from 'src/app/services/ui.service';
import { DataValueFetchService } from '../../../../services/dataValueFetch/data-value-fetch.service';
import { DataValueFetchInterface } from '../../../../resources/interfaces';
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
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { values } from 'lodash';
import { DatasetInterface, SourceInterface } from 'src/app/models/source.model';

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

  @Input() sendingObject: any;

  _htmlMarkup: SafeHtml | undefined;
  hasScriptSet: boolean | undefined;
  entryFormStatusColors: any;
  source: SourceInterface | undefined;
  query: string | undefined;
  dataValueFetchs: DataValueFetchInterface[] | undefined;
  dataValueFetch: any;

  constructor(
    private uiService: UiService,
    private sanitizer?: DomSanitizer,
    public dialog?: MatDialog,
    private reportService?: ReportsService
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
    } catch (e) {
      // console.log(JSON.stringify(e));
    }
  }

  ngAfterViewInit() {
    this.setScriptsOnHtmlContent(
      this.getScriptsContents(this.dataSetFormDesign)
    );

    // console.log("Dataset We need: ",this.dataset)
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
      console.log('Data set Values: ', dataElements);
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

  sendReport() {
    console.log(this.sendingObject);
    this.reportService
      ?.sendReport(this.sendingObject)
      .subscribe((values) => console.log(values));
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
