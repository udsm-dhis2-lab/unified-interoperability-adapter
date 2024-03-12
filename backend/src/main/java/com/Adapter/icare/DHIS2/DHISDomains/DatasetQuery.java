package com.Adapter.icare.DHIS2.DHISDomains;

import com.Adapter.icare.DHIS2.DHISServices.DatasetQueryService;
import com.Adapter.icare.Domains.BaseEntity;
import com.Adapter.icare.Domains.Datasets;
import com.Adapter.icare.Domains.Instances;
import com.Adapter.icare.Domains.User;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(uniqueConstraints={
        @UniqueConstraint(columnNames = {"dataSet", "instance"})
})
public class DatasetQuery extends BaseEntity implements Serializable  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Datasets dataSet;

    private String sqlQuery;

    @Column(nullable = false)
    private Instances instance;

    public static DatasetQuery fromMap(Map<String, Object> datasetQueryMap) {
        DatasetQuery datasetQuery = new DatasetQuery();

        if(datasetQueryMap.get("uuid") != null) {
            datasetQuery.setUuid((UUID) datasetQueryMap.get("uuid"));
        }
        if (datasetQueryMap.get("sql") != null) {
            datasetQuery.setSqlQuery(datasetQueryMap.get("sqlQuery").toString());
        }

        if (datasetQueryMap.get("dataSet") !=null) {
            String uuid = ((Map<String, Object>) datasetQueryMap.get("dataSet")).get("uuid").toString();
            Datasets datasets = new Datasets();
//            datasetQuery.setDataSet(datasetQueryMap.get("dataSet"));
        }
        return  datasetQuery;
    }
    public Map<String, Object> toMap() {
        HashMap<String, Object> dataSetsQueries = (new HashMap<String, Object>());
        dataSetsQueries.put("uuid",this.getUuid());
        dataSetsQueries.put("sql",this.getSqlQuery());
        dataSetsQueries.put("dataSet",this.getDataSet());
        dataSetsQueries.put("instance",this.getInstance());
        return dataSetsQueries;
    }
}
