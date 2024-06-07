package com.Adapter.icare.Domains;

import com.Adapter.icare.Utils.HashMapConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
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

    @Column(name = "namespace", nullable = false)
    private String namespace;

    @Column(name = "description")
    private String description;

    @Column(name = "data_key", nullable = false)
    private String dataKey;


    @Column(name = "value", columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String, Object> value;
}
