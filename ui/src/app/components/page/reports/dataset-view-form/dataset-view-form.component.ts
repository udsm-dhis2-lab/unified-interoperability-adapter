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

  @Output() dataValueUpdate: EventEmitter<any> = new EventEmitter<any>();

  _htmlMarkup: SafeHtml | undefined;
  hasScriptSet: boolean | undefined;
  entryFormStatusColors: any;
  source: SourceInterface | undefined;
  query: string | undefined;
  dataValueFetchs: DataValueFetchInterface[] | undefined;
  dataValueFetch: any;

  constructor(
    private dataValueFetchService: DataValueFetchService,
    private sanitizer?: DomSanitizer,
    private elementRef?: ElementRef,
    public dialog?: MatDialog,
    private router?: Router,
    private route?: ActivatedRoute
  ) {
    this.entryFormStatusColors = {
      OK: '#b9ffb9',
      WAIT: '#fffe8c',
      ERROR: '#ff8a8a',
      ACTIVE: '#488aff',
      NORMAL: '#ccc',
    };

    this.entryFormType = 'aggregate';

    // document.body.addEventListener(
    //   'dataValueUpdate',
    //   (e: CustomEvent) => {
    //     e.stopPropagation();
    //     const dataValueObject = e.detail;
    //     if (dataValueObject) {
    //       this.dataValueUpdate.emit(dataValueObject);
    //     }
    //   },
    //   false
    // );
  }

  ngOnInit() {
    try {
      this._htmlMarkup = this.sanitizer?.bypassSecurityTrustHtml(
        this.dataSetFormDesign.formdesignCode
      );
    } catch (e) {
      // console.log(JSON.stringify(e));
    }
  }

  ngAfterViewInit() {
    this.setScriptsOnHtmlContent(
      this.getScriptsContents(this.dataSetFormDesign.formdesignCode)
    );
    this.getEnabledInputTagsOnHtmlContent(
      this.dataSetFormDesign.formdesignCode
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
      onFormReady(
        this.entryFormType,
        dataElements,
        this.dataSetDataValues,
        this.entryFormStatusColors,
        this.isDataEntryLevel,
        scriptsContentsArray,
        function (
          entryFormType: any,
          entryFormStatusColors: any,
          isDataEntryLevel: any
        ) {
          // Listen for change event
          document.addEventListener(
            'change',
            function (event: any) {
              // If the clicked element doesn't have the right selector, bail
              console.log('Event: ', event);
              if (
                event.target.matches(
                  '.entryfield, .entryselect, .entrytrueonly, .entryfileresource'
                )
              ) {
                onDataValueChange(
                  event.target,
                  entryFormType,
                  entryFormStatusColors
                );
              }
              event.preventDefault();
            },
            false
          );

          // Embed inline javascripts
          // const scriptsContents = `
          // try {${scriptsContentsArray.join('')}} catch(e) { console.log(e);}`;
          // const script = document.createElement('script');
          // script.type = 'text/javascript';
          // script.innerHTML = scriptsContents;
          // document.getElementById('_custom_entry_form')!.appendChild(script);
        }
      );
    }
  }

  getEnabledInputTagsOnHtmlContent(html?: string) {
    let parser = new DOMParser();
    const formDesign = parser.parseFromString(html!, 'text/html');
    //Always disable input tags
    let inputElements = formDesign.getElementsByTagName('input');

    //Trying to get data existing after double clicking

    //end

    this.router!.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router!.onSameUrlNavigation = 'reload';
    // this.router!.navigate(['/'], {
    //   relativeTo: this.route
    // })
  }
}

