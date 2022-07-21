import { DataValueFetchService } from '../../../../services/dataValueFetch/data-value-fetch.service';
import { DatasetInterface, DataValueFetchInterface } from '../../../../resources/interfaces';
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
import { SourceInterface } from 'src/app/resources/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

  _htmlMarkup: SafeHtml | undefined;
  hasScriptSet: boolean | undefined;
  entryFormStatusColors: any;
  source: SourceInterface | undefined;
  query: string | undefined;
  dataValueFetchs: DataValueFetchInterface[] | undefined;
  dataValueFetch: any;

  constructor(
    private sanitizer?: DomSanitizer,
    public dialog?: MatDialog,
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
      console.log("Data set Values: ",dataElements)
      onFormReady(
        this.entryFormType,
        dataElements,
        this.datasetValues,
        this.entryFormStatusColors,
        this.isDataEntryLevel,
        scriptsContentsArray,
        true,
        () => {
        }
      );
    }
  }
}

