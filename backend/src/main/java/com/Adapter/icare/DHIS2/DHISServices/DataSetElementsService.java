/**BSD 3-Clause License

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

package com.Adapter.icare.DHIS2.DHISServices;


import com.Adapter.icare.Domains.DataSetElement;
import org.springframework.stereotype.Service;

import com.Adapter.icare.DHIS2.DHISRepository.DataSetElementsRepository;

import java.util.UUID;

@Service
public class DataSetElementsService {
    
    private final DataSetElementsRepository dataSetElementsRepository;

    public DataSetElementsService(DataSetElementsRepository dataSetElementsRepository) {
        this.dataSetElementsRepository = dataSetElementsRepository;
    }

    public void addDataSetElements(DataSetElement dataSetElement) {
        if (dataSetElement.getUuid() == null) {
            UUID uuid = UUID.randomUUID();
            dataSetElement.setUuid(uuid.toString());
        }
        dataSetElementsRepository.save(dataSetElement);
    }

    public DataSetElement SearchExistingDataSetElements(DataSetElement dataSetElement) {
        //Manipulating the received dataset element request
        String dataElementsCategoryOptionCombString = dataSetElement.getDataElementCategoryOptionCombo();
        String[] stringArray = dataElementsCategoryOptionCombString.split("-");
        dataSetElement.setDataElement(stringArray[0]);
        dataSetElement.setCategoryOptionCombo(stringArray[1]);

        String dataElement = dataSetElement.getDataElement();
        String categoryOptionCombo = dataSetElement.getCategoryOptionCombo();
        String dataset = dataSetElement.getDataset().getId();

        return dataSetElementsRepository.searchExistingDataSetElements(dataElement,categoryOptionCombo,dataset);
    }

    

}
