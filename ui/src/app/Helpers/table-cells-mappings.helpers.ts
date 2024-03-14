import { flatten } from 'lodash';

function identifyMaximumRowsWithEntryFields(tableRowsMetadata: any[]): number {
  let maximumCells: number = 1;
  for (let count = 0; count < tableRowsMetadata?.length; count++) {
    if (tableRowsMetadata[count]?.cells?.length > maximumCells)
      maximumCells = tableRowsMetadata[count]?.cells?.length;
  }
  return maximumCells;
}

function filterCellsWithIds(cells: any[]): any[] {
  return cells?.filter((cell: any) => cell?.id?.length > 0) || [];
}

export function formatTableRowsMetadataForMappings(
  tableRowsMetadata: any[]
): any {
  //   const maximumCells = identifyMaximumRowsWithEntryFields(tableRowsMetadata);
  return tableRowsMetadata.map((tableRow: any) => {
    if (tableRow?.cells?.length > 0) {
      return {
        ...tableRow,
        cells: tableRow?.cells,
      };
    }
  });
}

export function createReferencesFromQueryOutputs(query: string): any[] {
  let queryOutputs: any[] = [];
  queryOutputs = query.split('UNION').map((queryRow: string, index: number) => {
    // console.log('queryRow', queryRow);
    queryRow = query.replace(/\n/g, '');
    return {
      row: index,
      outputs:
        (
          flatten(
            (
              queryRow
                .split(',')
                .filter(
                  (output: string) => output.toLowerCase().indexOf('as') > -1
                ) || []
            ).map((expectedOutput: string) => {
              const columnsString: string = expectedOutput
                ?.toLocaleLowerCase()
                .replace('select ', '')
                .split(' ')
                .join('');
              const pattern = /(["'])(?:(?=(\\?))\2.)*?\1/g;
              return flatten(
                columnsString.match(pattern)?.map((matched: any) => {
                  if (matched.length > 1) return matched?.split('"').join('');
                  return null;
                }) || []
              );
            }) || []
          ).filter((matched: any) => matched && matched.length > 2) || []
        ).map((formatted: any) => {
          return {
            key: formatted,
            value: formatted,
            row: Number(formatted?.split('-')[0]),
            column: Number(formatted.split('-')[1]),
          };
        }) || [],
    };
  });
  return queryOutputs;
}
