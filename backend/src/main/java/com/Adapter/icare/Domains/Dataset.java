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

package com.Adapter.icare.Domains;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import javax.persistence.*;

import com.Adapter.icare.Utils.HashMapConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "datasets")
public class Dataset extends BaseEntity implements Serializable {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(length = 50)
    private String id;
    private String displayName;
    private String periodType;

    @Lob
    private String formDesignCode;

    private int timelyDays;

    private int expiryDays;

    private String formType;

    private String code;

    @Column(columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String,Object> categoryCombo;


    @Column(columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String,Object> dataElements;

    @Column(columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String, Object> datasetFields;
    
    @ManyToOne
    private Instance instances;

    public Map<String,Object> toMap() {
        Map<String,Object> dataSetMap = new HashMap<>();

        dataSetMap.put("uuid", this.getUuid());
        dataSetMap.put("code", this.getCode());
        dataSetMap.put("name", this.getDisplayName());
        dataSetMap.put("formType", this.getFormType());
        dataSetMap.put("periodType", this.getPeriodType());
        dataSetMap.put("formDesignCode", this.getFormDesignCode());
        dataSetMap.put("timelyDays", this.getTimelyDays());
        dataSetMap.put("expiryDays", this.getExpiryDays());
        dataSetMap.put("categoryCombo", this.getCategoryCombo());
        dataSetMap.put("dataElements", this.getDataElements());
        dataSetMap.put("datasetFields", this.getDatasetFields());
        dataSetMap.put("instance", this.getInstances().toMap());

        Map<String, Object> createdBy = new HashMap<>();
        if (this.getCreatedBy() != null) {
            createdBy.put("uuid", this.getCreatedBy().getUuid());
            createdBy.put("username", this.getCreatedBy().getUsername());
            createdBy.put("names", this.getCreatedBy().getFirstName() + " " + this.getCreatedBy().getSurname());
        } else {
            createdBy = null;
        }
        dataSetMap.put("createdBy",createdBy);

        Map<String, Object> lastUpdatedBy = new HashMap<>();
        if (this.getLastUpdatedBy() != null) {
            lastUpdatedBy.put("uuid", this.getLastUpdatedBy().getUuid());
            lastUpdatedBy.put("username", this.getLastUpdatedBy().getUsername());
            lastUpdatedBy.put("names", this.getLastUpdatedBy().getFirstName() + " " + this.getLastUpdatedBy().getSurname());
        } else {
            lastUpdatedBy = null;
        }
        dataSetMap.put("lastUpdatedOn", this.getLastUpdatedOn());
        dataSetMap.put("lastUpdatedBy",lastUpdatedBy);
        return dataSetMap;
    }
    
}
