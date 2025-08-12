package com.Adapter.icare.Domains;

import com.Adapter.icare.Utils.HashMapConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name="datastore",uniqueConstraints = { @UniqueConstraint( name = "namespace_and_data_key_unique_constraint", columnNames = { "namespace", "data_key" } ) })
public class Datastore  extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="datastore_group")
    private String datastoreGroup;

    @Column(name = "namespace", nullable = false)
    private String namespace;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "data_key", nullable = false)
    private String dataKey;

    @Column(name = "value", columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String, Object> value;

    public Map<String, Object> toMap() {
        Map<String, Object> mappedDatastore = new HashMap<>();
        mappedDatastore.put("uuid", this.getUuid());
        mappedDatastore.put("namespace", this.getNamespace());
        mappedDatastore.put("dataKey", this.getDataKey());
        mappedDatastore.put("value", this.getValue());
        mappedDatastore.put("description", this.getDescription());
        if (this.getCreatedBy() != null) {
            mappedDatastore.put("createdBy", this.getCreatedBy().getReferencedProperties());
        }
        if (this.getLastUpdatedBy() != null) {
            mappedDatastore.put("lastUpdatedBy", getLastUpdatedBy().getReferencedProperties());
        }
        mappedDatastore.put("createdOn", getCreatedOn());
        mappedDatastore.put("lastUpdatedOn", getLastUpdatedOn());
        return mappedDatastore;
    }
}
