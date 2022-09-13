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

    public static RemoteDatasets fromMap(Map<String, Object> RemoteDataSetMap) {
        RemoteDatasets newRemoteDataSet = new RemoteDatasets();
        newRemoteDataSet.setId((String) RemoteDataSetMap.get("id"));
        newRemoteDataSet.setDisplayName((String) RemoteDataSetMap.get("displayName"));
        return newRemoteDataSet;
    }

    public Map<String, Object> toMap() {
        HashMap<String, Object> RemoteDataSetMap = (new HashMap<String, Object>());
        RemoteDataSetMap.put("id",this.getId());
        RemoteDataSetMap.put("displayName",this.getDisplayName());
        return RemoteDataSetMap;
    }

}
