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

import { map } from 'rxjs';
import { Data } from '@angular/router';
import * as _ from 'lodash';

function getSanitizedValue(value: any, type: any) {
  switch (type) {
    case 'TRUE_ONLY':
      return convertToBoolean(value);
    default:
      return value;
  }
}

function convertToBoolean(stringValue: any) {
  return stringValue === 'true'
    ? Boolean(true)
    : 'false'
    ? Boolean(false)
    : stringValue;
}

function getSelectInput(id: any, value: any, options: any) {
  let select =
    '<select id="' +
    id +
    '" class="entryselect"><option value="" disabled selected>Select option</option>';

  options.forEach(function (option: any) {
    if (option.code === value) {
      select +=
        '<option value="' +
        option.code +
        '" selected>' +
        option.name +
        '</option>';
    } else {
      select +=
        '<option value="' + option.code + '">' + option.name + '</option>';
    }
  });
  select += '</select>';
  return select;
}

function updateFormFieldColor(elementId: any, statusColor: any) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.backgroundColor = statusColor;
  }
}

export function onFormReady(
  formType: any,
  dataElements: any,
  dataValues: any,
  entryFormStatusColors: any,
  isDataEntryLevel: any,
  scriptsContentsArray: any,
  forReporting: boolean,
  formReady: any
) {
  //Set values if any
  if (forReporting) {
    dataValues.dataValues.map((dataValue: any) => {
      let element = document.getElementById(dataValue.id);
      element?.setAttribute('value', dataValue.val);
    });
  }

  // Find table elements and set bootstrap classes
  const tableElements = document.getElementsByTagName('TABLE');
  _.each(tableElements, (tableElement: any) => {
    tableElement.setAttribute('class', 'table-custom-class table-sm');
    tableElement.setAttribute('width', '100%');
  });

  // Find input items and set required properties to them
  const inputElements = document.getElementsByTagName('INPUT');
  _.each(inputElements, (inputElement: any) => {
    // Get attribute from the element
    const elementId = inputElement.getAttribute('id');
    const attributeId = inputElement.getAttribute('attributeid');

    // Get splitted ID to get data element and category combo ids
    const splitedId =
      formType === 'aggregate' || formType === 'event'
        ? elementId
          ? elementId.split('-')
          : []
        : attributeId
        ? attributeId.split('-')
        : [];

    const dataElementId = formType === 'event' ? splitedId[1] : splitedId[0];
    const optionComboId =
      formType === 'event'
        ? 'dataElement'
        : formType === 'tracker'
        ? 'trackedEntityAttribute'
        : splitedId[1];

    // Get data element details
    const dataElementDetails = _.find(dataElements, ['id', dataElementId]);

    // Get dataElement type
    const dataElementType = dataElementDetails
      ? dataElementDetails.valueType
      : null;

    // Get element value
    const dataValueObject: any = _.find(dataValues, {
      dataElement: dataElementId,
      categoryOptionCombo: optionComboId,
    });
    const dataElementValue = getSanitizedValue(
      dataValueObject ? dataValueObject.value : '',
      dataElementType
    );

    // Update DOM based on data element type
    if (dataElementType) {
      inputElement.disabled = !isDataEntryLevel;
      if (dataElementDetails.optionSet) {
        inputElement.replaceWith(
          getSelectInput(
            elementId,
            dataElementValue,
            dataElementDetails.optionSet.options
          )
        );
      } else {
        if (
          dataElementType === 'NUMBER' ||
          dataElementType.indexOf('INTEGER') > -1
        ) {
          inputElement.setAttribute('type', 'number');
          inputElement.setAttribute('class', 'entryfield');

          if (dataElementType === 'INTEGER_POSITIVE') {
            inputElement.setAttribute('min', 1);
          } else if (dataElementType === 'INTEGER_NEGATIVE') {
            inputElement.setAttribute('max', -1);
          } else if (dataElementType === 'INTEGER_ZERO_OR_POSITIVE') {
            inputElement.setAttribute('min', 0);
          }
          inputElement.value = dataElementValue;
        } else {
          inputElement.setAttribute('class', 'entryfield');
          if (forReporting) {
            inputElement.setAttribute('disabled', forReporting);
            inputElement.style.pointerEvents = 'none';
          }
        }
      }
    } else {
      inputElement.setAttribute('type', 'number'); // by default if no valuetype make input type number
      inputElement.setAttribute('class', 'entryfield text-center');
      if (forReporting) {
        inputElement.setAttribute('disabled', forReporting);
        inputElement.style.pointerEvents = 'none';
      }
    }

    inputElement.setAttribute('type', 'text');
  });

  // NOW create totals
  const totalElems = document.querySelectorAll('[name="indicatorFormula"]');
  totalElems.forEach((totalElem) => {
    let formulaToEvaluate: any;
    formulaToEvaluate = totalElem?.getAttribute('indicatorFormula')
      ? totalElem.getAttribute('indicatorFormula')
      : '';
    const formulaPattern = /#\{.+?\}/g;
    formulaToEvaluate?.match(formulaPattern)?.forEach((matchedItem: any) => {
      // get value
      const valueElem = document.getElementById(
        matchedItem
          ?.split('#{')
          .join('')
          ?.split('}')
          .join('')
          .split('.')
          .join('-') + '-val'
      );
      const dataValue = valueElem?.getAttribute('value')
        ? valueElem?.getAttribute('value')
        : '0';
      formulaToEvaluate = formulaToEvaluate?.replace(matchedItem, dataValue);
    });
    const dataEvaluated = eval(formulaToEvaluate);
    totalElem?.setAttribute('value', dataEvaluated);
  });

  // formReady(formType, entryFormStatusColors, scriptsContentsArray);
}

export function onDataValueChange(
  element: any,
  entryFormType: string,
  entryFormColors: any
) {
  // Get attribute from the element
  const elementId = element.getAttribute('id');

  // Get splitted ID to get data element and category combo ids
  const splitedId = elementId ? elementId.split('-') : [];

  const dataElementId = entryFormType === 'event' ? splitedId[1] : splitedId[0];
  const optionComboId =
    entryFormType === 'event'
      ? 'dataElement'
      : entryFormType === 'tracker'
      ? 'trackedEntityAttribute'
      : splitedId[1];

  // find element value
  const elementValue = element.value;

  // Update item color
  updateFormFieldColor(elementId, entryFormColors['WAIT']);

  // create custom event for saving data values
  const dataValueEvent = new CustomEvent('dataValueUpdate', {
    detail: {
      dataElement: dataElementId,
      categoryOptionCombo: optionComboId,
      value: elementValue,
      domElementId: elementId,
    },
  });
  document.body.dispatchEvent(dataValueEvent);
}
