package com.Adapter.icare.DHIS2.DHISDomains;

import com.Adapter.icare.Domains.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(uniqueConstraints={
        @UniqueConstraint(columnNames = {"data_sets_id", "instances_id"})
})
public class DatasetQuery extends BaseEntity implements Serializable  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Dataset dataSets;

    private String sqlQuery;

    @ManyToOne
    private Instance instances;

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
            Dataset dataset = new Dataset();
//            datasetQuery.setDataSet(datasetQueryMap.get("dataSet"));
        }
        return  datasetQuery;
    }
    public Map<String, Object> toMap() {
        HashMap<String, Object> dataSetsQueries = (new HashMap<String, Object>());
        dataSetsQueries.put("uuid",this.getUuid());
        dataSetsQueries.put("sqlQuery",this.getSqlQuery());
        dataSetsQueries.put("dataSetInstance",this.getDataSets());
        dataSetsQueries.put("instance",this.getInstances());
        dataSetsQueries.put("dataSource", this.getDataSource());
        dataSetsQueries.put("mappings", this.getMappings());
        return dataSetsQueries;
    }
}
