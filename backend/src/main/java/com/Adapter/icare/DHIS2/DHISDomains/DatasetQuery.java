package com.Adapter.icare.DHIS2.DHISDomains;

import com.Adapter.icare.Domains.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(uniqueConstraints={
        @UniqueConstraint(columnNames = {"data_set_id", "instance_id"})
})
public class DatasetQuery extends BaseEntity implements Serializable  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Datasets dataSet;

    private String sqlQuery;

    @ManyToOne
    private Instances instance;

    @ManyToOne
    private Datasource dataSource;

    @Lob
    private String mappings;

    public static DatasetQuery fromMap(Map<String, Object> datasetQueryMap) {
        DatasetQuery datasetQuery = new DatasetQuery();

        if(datasetQueryMap.get("uuid") != null) {
            datasetQuery.setUuid(datasetQueryMap.get("uuid").toString());
        }
        if (datasetQueryMap.get("sqlQuery") != null) {
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
        dataSetsQueries.put("sqlQuery",this.getSqlQuery());
        dataSetsQueries.put("dataSetInstance",this.getDataSet());
        dataSetsQueries.put("instance",this.getInstance());
        dataSetsQueries.put("dataSource", this.getDataSource());
        dataSetsQueries.put("mappings", this.getMappings());
        return dataSetsQueries;
    }
}
