import { DataValueFetchService } from './../../../../services/dataValueFetch/data-value-fetch.service';
import { DatasetInterface, DataValueFetchInterface } from './../../../../resources/interfaces';
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
import { AddQueryComponent } from './add-query/add-query.component';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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
  
  constructor(
    private dataValueFetchService: DataValueFetchService,
    private sanitizer?: DomSanitizer, 
    private elementRef?: ElementRef,
    public dialog?: MatDialog,
    private router?: Router,
    private route?: ActivatedRoute
  ) 
  {
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
    this.getEnabledInputTagsOnHtmlContent(this.sources, this, this.dataSetFormDesign.formdesignCode)
    
    // console.log("Dataset We need: ",this.dataset)
  }

  getScriptsContents(html: any) {
    if (html){
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
        function (entryFormType: any, entryFormStatusColors: any, isDataEntryLevel: any) {
          // Listen for change event
          document.addEventListener(
            'change',
            function (event: any) {
              // If the clicked element doesn't have the right selector, bail
              console.log("Event: ",event);
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

  getEnabledInputTagsOnHtmlContent(sources?: SourceInterface[], thisComponent?: CustomFormComponent, html?: string){
    let parser = new DOMParser();
    const formDesign = parser.parseFromString(html!, 'text/html');
    //Always disable input tags
    let inputElements = formDesign.getElementsByTagName('input');




    //Trying to get data existing after double clicking 
    

    //end

    document.addEventListener('click', async function(event: any) {
      if(event.target.name === 'entryfield'){
        thisComponent?.openDialog(sources!, event.target.id);
      }
    })
  }

  
  async openDialog(sourcesToChoose: SourceInterface[], elementId: string): Promise<any> {
      
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

        console.log('Data Value Fetching 1: ', this.dataValueFetch);
      });

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log('Data Value Fetching 2: ', this.dataValueFetch);
   
    const dialogRef = this.dialog?.open(AddQueryComponent, {
      autoFocus: true,
      // disableClose: true,
      width: '50%',
      data: {
        sources: sourcesToChoose,
        query: this.dataValueFetch?.sqlQuery,
        source: this.dataValueFetch?.datasource,
        elementId: elementId,
        id: this.dataValueFetch?.id
      },
    });

    // console.log("Opened: "+ this.dataValueFetch);

    dialogRef?.afterClosed().subscribe(result => {
      if(result){
          this.source = result.source;
          this.query = result.query;
          // console.log("Source: "+this.source?.type + " Query:" + this.query + ' Dataset: ' + this.dataset?.displayName+ ' Element ID: ' + result.elementId)
          this.addDataValueFetch(this.source?.id, this.query, this.dataset?.id, result.elementId, result.id);
          
      } 
      else{
        console.log("No data found");  
        this.source = undefined;
        this.query = undefined;
        
      }  

      this.router!.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router!.onSameUrlNavigation = 'reload';
      // this.router!.navigate(['/'], {
      //   relativeTo: this.route
      // })

    });
  }

  addDataValueFetch(dataSource?: number, query?: string, dataset?: string,  elementCombo?: string, id?: any){
    
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
      }  
    this.dataValueFetchService.addDataValueFetch(dataValueFetchObject).subscribe((dataValueFetch) => (this.dataValueFetchs?.push(dataValueFetch)));

  }

}
