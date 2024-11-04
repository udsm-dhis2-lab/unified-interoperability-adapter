package com.Adapter.icare.Domains;

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
@Table(name="mediator_api",uniqueConstraints = { @UniqueConstraint( name = "mediator_api_category_unique_constraint", columnNames = { "mediator_id", "api", "category" } ) })
public class MediatorApiPath implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mediator_id", nullable = false)
    private Mediator mediator;
    private String api;
    private String category;
    private Boolean active;

    public Map<String,Object> toMap() {
        Map<String,Object> apiMap = new HashMap<>();
        apiMap.put("api", this.getApi());
        apiMap.put("category", this.getCategory());
        apiMap.put("active", this.getActive());
        return apiMap;
    }
}
