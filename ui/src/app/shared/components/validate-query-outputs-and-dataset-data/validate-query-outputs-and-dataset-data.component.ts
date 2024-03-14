import { Component, Input, OnInit } from '@angular/core';
import { createReferencesFromQueryOutputs } from 'src/app/Helpers/table-cells-mappings.helpers';
import { keyBy, flatten } from 'lodash';

@Component({
  selector: 'app-validate-query-outputs-and-dataset-data',
  templateUrl: './validate-query-outputs-and-dataset-data.component.html',
  styleUrls: ['./validate-query-outputs-and-dataset-data.component.css'],
})
export class ValidateQueryOutputsAndDatasetDataComponent implements OnInit {
  @Input() query: string;
  @Input() tableRowsMetadata: any[];
  queryOutputsReferences: any[];
  keyedQueryOutputsReferences: any = {};
  constructor() {}

  ngOnInit(): void {
    this.queryOutputsReferences = createReferencesFromQueryOutputs(this.query);
    this.keyedQueryOutputsReferences = keyBy(
      flatten(
        this.queryOutputsReferences.map((reference: any) => reference?.outputs)
      ),
      'key'
    );
  }
}
