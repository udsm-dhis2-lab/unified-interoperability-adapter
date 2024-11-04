package com.Adapter.icare.Domains;

import com.Adapter.icare.Dtos.MediatorDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "mediator")
public class Mediator  extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String baseUrl;
    private String path;

    @Column(name="code", nullable = true)
    private String code;

    @Column(name = "auth_token", nullable = true)
    private String authToken;

    @Column(name = "auth_type", nullable = true)
    private String authType;

    @Column(name="category", nullable = true)
    private String category;

    @OneToMany(mappedBy = "mediator", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<MediatorApiPath> apis = new HashSet<>();

    public enum AuthType{
        BASIC("BASIC"),
        TOKEN("TOKEN");
        final String value;
        AuthType(String value){
            this.value = value;
        }
        public String getValue(){
            return value;
        }
    }

    public enum Category{
        DATA_TEMPLATE_METADATA("DATA_TEMPLATE_METADATA"),
        DATA_TEMPLATE("DATA_TEMPLATE"),
        FHIR("FHIR"),
        WHOICDAPI("WHOICDAPI"),
        HEALTH_FACILITY("HEALTH_FACILITY"),
        LABORATORY("LABORATORY"),
        OPENMRS("OPENMRS");

        final String value;
        Category(String value){
            this.value = value;
        }
        public String getValue(){
            return value;
        }
    }

    public Mediator fromMap(MediatorDTO mediatorDTO) {
        Mediator mediator = new Mediator();
        mediator.setBaseUrl(mediatorDTO.getBaseUrl());
        mediator.setPath(mediatorDTO.getPath());
        mediator.setCode(mediatorDTO.getCode());
        mediator.setCategory(mediatorDTO.getCategory());
        mediator.setAuthToken(mediatorDTO.getAuthToken());
        mediator.setAuthType(mediatorDTO.getAuthType());
        mediator.setApis(mediatorDTO.getApis());
        return mediator;
    }

    public Map<String,Object> toMap() {
        Map<String,Object> mappedMediator = new HashMap<>();
        mappedMediator.put("uuid", this.getUuid());
        mappedMediator.put("code", this.getCode());
        mappedMediator.put("baseUrl", this.getBaseUrl());
        mappedMediator.put("path", this.getPath());
        mappedMediator.put("authType",this.authType);
        mappedMediator.put("category",this.getCategory());
        mappedMediator.put("authToken",this.getAuthToken());
        mappedMediator.put("createdOn", this.getCreatedOn());
        Map<String, Object> createdBy = new HashMap<>();
        if (this.getCreatedBy() != null) {
            createdBy.put("uuid", this.getCreatedBy().getUuid());
            createdBy.put("username", this.getCreatedBy().getUsername());
            createdBy.put("names", this.getCreatedBy().getFirstName() + " " + this.getCreatedBy().getSurname());
        } else {
            createdBy = null;
        }
        mappedMediator.put("createdBy",createdBy);

        Map<String, Object> lastUpdatedBy = new HashMap<>();
        if (this.getLastUpdatedBy() != null) {
            lastUpdatedBy.put("uuid", this.getLastUpdatedBy().getUuid());
            lastUpdatedBy.put("username", this.getLastUpdatedBy().getUsername());
            lastUpdatedBy.put("names", this.getLastUpdatedBy().getFirstName() + " " + this.getLastUpdatedBy().getSurname());
        } else {
            lastUpdatedBy = null;
        }
        List<Map<String,Object>> apis = new ArrayList<>();
        for (MediatorApiPath mediatorApiPath: this.getApis()) {
            apis.add(mediatorApiPath.toMap());
        }
        mappedMediator.put("apis",apis);
        mappedMediator.put("lastUpdatedOn", this.getLastUpdatedOn());
        mappedMediator.put("lastUpdatedBy",lastUpdatedBy);
        return mappedMediator;
    }
}
