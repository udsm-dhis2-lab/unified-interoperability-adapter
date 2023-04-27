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

package com.Adapter.icare.DHIS2.DHISDomains;

import java.util.HashMap;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RemoteDatasets {
    
    private String id;
    private String displayName;

    private String shortName;

    private String periodType;

    private int dataSetElements;

    private int version;

    private int expiryDays;

    private int timelyDays;

    private int openFuturePeriods;

    private boolean renderAsTabs;

    private boolean renderHorizontally;

    private boolean compulsoryFieldsCompleteOnly;

    private String formType;

    private String code;

    public static RemoteDatasets fromMap(Map<String, Object> RemoteDataSetMap) {
        RemoteDatasets newRemoteDataSet = new RemoteDatasets();
        newRemoteDataSet.setId((String) RemoteDataSetMap.get("id"));
        newRemoteDataSet.setDisplayName((String) RemoteDataSetMap.get("displayName"));
        if(RemoteDataSetMap.get("dataSetElements")!= null) {
            newRemoteDataSet.setDataSetElements((int) RemoteDataSetMap.get("dataSetElements"));
        }

        if(RemoteDataSetMap.get("formType")!= null) {
            newRemoteDataSet.setFormType((String) RemoteDataSetMap.get("formType"));
        }

        if(RemoteDataSetMap.get("code")!= null) {
            newRemoteDataSet.setCode((String) RemoteDataSetMap.get("code"));
        }

        if(RemoteDataSetMap.get("shortName")!= null) {
            newRemoteDataSet.setShortName((String) RemoteDataSetMap.get("shortName"));
        }

        if(RemoteDataSetMap.get("periodType")!= null) {
            newRemoteDataSet.setPeriodType((String) RemoteDataSetMap.get("periodType"));
        }

        if(RemoteDataSetMap.get("version")!= null) {
            newRemoteDataSet.setVersion((int) RemoteDataSetMap.get("version"));
        }

        if(RemoteDataSetMap.get("expiryDays")!= null) {
            newRemoteDataSet.setExpiryDays((int) RemoteDataSetMap.get("expiryDays"));
        }

        if(RemoteDataSetMap.get("timelyDays")!= null) {
            newRemoteDataSet.setTimelyDays((int) RemoteDataSetMap.get("timelyDays"));
        }

        if(RemoteDataSetMap.get("openFuturePeriods")!= null) {
            newRemoteDataSet.setOpenFuturePeriods((int) RemoteDataSetMap.get("openFuturePeriods"));
        }

        if(RemoteDataSetMap.get("renderAsTabs")!= null) {
            newRemoteDataSet.setRenderAsTabs((boolean) RemoteDataSetMap.get("renderAsTabs"));
        }

        if(RemoteDataSetMap.get("renderHorizontally")!= null) {
            newRemoteDataSet.setRenderHorizontally((boolean) RemoteDataSetMap.get("renderHorizontally"));
        }

        if(RemoteDataSetMap.get("compulsoryFieldsCompleteOnly")!= null) {
            newRemoteDataSet.setCompulsoryFieldsCompleteOnly((boolean) RemoteDataSetMap.get("compulsoryFieldsCompleteOnly"));
        }



        return newRemoteDataSet;
    }

    public Map<String, Object> toMap() {
        HashMap<String, Object> RemoteDataSetMap = (new HashMap<String, Object>());
        RemoteDataSetMap.put("id",this.getId());
        RemoteDataSetMap.put("displayName",this.getDisplayName());
        return RemoteDataSetMap;
    }

}
