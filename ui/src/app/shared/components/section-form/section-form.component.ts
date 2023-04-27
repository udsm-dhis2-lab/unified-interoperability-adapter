import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { keyBy } from 'lodash';
import { AddQueryComponent } from 'src/app/components/page/mapping/custom-form/add-query/add-query.component';
import { SourceInterface } from 'src/app/models/source.model';
import { DataValueFetchInterface } from 'src/app/resources/interfaces';
import { DataValueFetchService } from 'src/app/services/dataValueFetch/data-value-fetch.service';

@Component({
  selector: 'app-section-form',
  templateUrl: './section-form.component.html',
  styleUrls: ['./section-form.component.css'],
})
export class SectionFormComponent implements OnInit {
  @Input() dataset: any | undefined;
  @Input() datasources: any[] | undefined;
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
    this.dataset = {
      ...this.dataset,
      datasetFields: {
        name: 'RRH Hospital Maalum, Kanda na Taifa Proxy indicator',
        id: 'k40eyWNxF6x',
        shortName: 'RRH Hospital Maalum Kanda na Taifa Proxy indicator',
        renderHorizontally: false,
        formType: 'SECTION',
        renderAsTabs: true,
        displayName: 'RRH Hospital Maalum, Kanda na Taifa Proxy indicator',
        compulsoryFieldsCompleteOnly: false,
        version: 7,
        timelyDays: 15,
        periodType: 'Daily',
        openFuturePeriods: 0,
        expiryDays: 0,
        categoryCombo: {
          name: 'default',
          id: 'zieTL0JUp1o',
          dataDimensionType: 'DISAGGREGATION',
          categoryOptionCombos: [
            {
              name: 'default',
              id: 'uGIJ6IdkP7Q',
            },
          ],
        },
        dataSetElements: [
          {
            dataElement: {
              name: 'RRH-Gharama ya msamaha',
              id: 'k0FIKGYUvkf',
              shortName: 'Gharama ya msamaha',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Rufaa zilizotolewa',
              id: 'Sl2LdyFJ2mc',
              shortName: 'Idadi ya Rufaa zilizotolewa',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Chupa za damu zilizopo',
              id: 'Wh1IE3apNel',
              shortName: 'Idadi ya Chupa za damu zilizopo',
              aggregationType: 'LAST_IN_PERIOD',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya wagonjwa waliolazwa (IPD)',
              id: 'LXpngsG6fS5',
              shortName: 'Idadi ya wagonjwa waliolazwa (IPD)',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Wagonjwa wa nje (OPD)',
              id: 'jobVk57adwJ',
              shortName: 'Idadi ya Wagonjwa wa nje (OPD)',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya malalamiko',
              id: 'Xj0ZVjzedcu',
              shortName: 'Idadi ya malalamiko',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Rufaa zilizotolewa kwenda nje ya nchi',
              id: 'Ep4MzaikqBS',
              shortName: 'Idadi ya Rufaa zilizotolewa kwenda nje ya nchi',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Vifo vya wajawazito',
              id: 'Hnx9CWdVZcB',
              shortName: 'Idadi ya Vifo vya wajawazito',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya wagonjwa waliopata dawa',
              id: 'oI5ZntBZoTS',
              shortName: 'Idadi ya wagonjwa waliopata dawa',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya vipimo vya X-ray',
              id: 'WA1cPFlc94O',
              shortName: 'RRH-Idadi ya vipimo vya X-ray',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya vipimo vya MRI',
              id: 'gfR8YQOnxoU',
              shortName: 'Idadi ya vipimo vya MRI',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Mama waliojifungua',
              id: 'D09bwVuHFEN',
              shortName: 'Idadi ya Mama waliojifungua',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Vifo vya watoto wachanga',
              id: 'aeAOHZ7G27w',
              shortName: 'Idadi ya Vifo vya watoto wachanga',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya Vifo vilivyotokea',
              id: 'xUdZMXazToW',
              shortName: 'Idadi ya Vifo vilivyotokea',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Jumla ya makusanyo',
              id: 'xkd6IgCW7GD',
              shortName: 'Jumla ya makusanyo',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya wagonjwa walioandikiwa dawa',
              id: 'K2l7s1F1JXB',
              shortName: 'Idadi ya wagonjwa walioandikiwa dawa',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya wagonjwa waliopewa msamaha',
              id: 'JvMkFaGgeCD',
              shortName: 'Idadi ya wagonjwa waliopewa msamaha',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
          {
            dataElement: {
              name: 'RRH-Idadi ya vipimo vya CT',
              id: 'G2JT20bBLSJ',
              shortName: 'Idadi ya vipimo vya CT',
              aggregationType: 'SUM',
              domainType: 'AGGREGATE',
              valueType: 'INTEGER_ZERO_OR_POSITIVE',
              zeroIsSignificant: false,
              optionSetValue: false,
              categoryCombo: {
                name: 'default',
                id: 'zieTL0JUp1o',
                dataDimensionType: 'DISAGGREGATION',
                categoryOptionCombos: [
                  {
                    name: 'default',
                    id: 'uGIJ6IdkP7Q',
                  },
                ],
              },
            },
          },
        ],
        attributeValues: [],
        sections: [
          {
            name: 'RRH na Hospitali Maalum, Kanda na Taifa --Proxy Indicators',
            id: 'sM2ILCxKchl',
            sortOrder: 1,
            showRowTotals: false,
            showColumnTotals: false,
            dataElements: [
              {
                id: 'jobVk57adwJ',
              },
              {
                id: 'LXpngsG6fS5',
              },
              {
                id: 'xUdZMXazToW',
              },
              {
                id: 'D09bwVuHFEN',
              },
              {
                id: 'Hnx9CWdVZcB',
              },
              {
                id: 'aeAOHZ7G27w',
              },
              {
                id: 'Sl2LdyFJ2mc',
              },
              {
                id: 'K2l7s1F1JXB',
              },
              {
                id: 'oI5ZntBZoTS',
              },
              {
                id: 'Wh1IE3apNel',
              },
              {
                id: 'Ep4MzaikqBS',
              },
              {
                id: 'xkd6IgCW7GD',
              },
              {
                id: 'Xj0ZVjzedcu',
              },
              {
                id: 'JvMkFaGgeCD',
              },
              {
                id: 'k0FIKGYUvkf',
              },
              {
                id: 'WA1cPFlc94O',
              },
              {
                id: 'G2JT20bBLSJ',
              },
              {
                id: 'gfR8YQOnxoU',
              },
            ],
          },
        ],
      },
    };

    this.dataElementsDetails = keyBy(
      this.dataset?.datasetFields?.dataSetElements?.map(
        (datasetElement: any) => {
          return datasetElement?.dataElement;
        }
      ),
      'id'
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
