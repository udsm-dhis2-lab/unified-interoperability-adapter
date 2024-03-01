package com.Adapter.icare.DHIS2.DHISDomains;

import com.Adapter.icare.Domains.BaseEntity;
import com.Adapter.icare.Domains.Instances;
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
        @UniqueConstraint(columnNames = {"dataSet", "instance"})
})
public class DatasetQuery extends BaseEntity implements Serializable  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String dataSet;
    private String SqlQuery;
    @Column(nullable = false)
    private Instances instance;

    public Map<String, Object> toMap() {
        HashMap<String, Object> dataSetsQueries = (new HashMap<String, Object>());
        dataSetsQueries.put("uuid",this.getUuid());
        dataSetsQueries.put("sql",this.getSqlQuery());
        dataSetsQueries.put("dataSet",this.getDataSet());
        dataSetsQueries.put("instance",this.getInstance());
        return dataSetsQueries;
    }
}
