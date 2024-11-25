package com.Adapter.icare.Domains;

import com.Adapter.icare.Utils.HashMapConverter;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "data_element")
public class DataElement extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "dhis2_id", unique = true, nullable = false)
    private String dhis2Id;
    private String name;
    private String shortName;
    @Column(columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String,Object> details;
}
