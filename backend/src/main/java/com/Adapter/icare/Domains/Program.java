package com.Adapter.icare.Domains;

import com.Adapter.icare.Utils.HashMapConverter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Entity
public class Program {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String uuid = UUID.randomUUID().toString();

    private String programId; // DHIS2 program id

    private String displayName;

    private String displayShortName;

    private String description;

    @Column(columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String, Object> programStageSections = new HashMap<>();

    @Column(columnDefinition = "json", nullable = false)
    @Convert(converter = HashMapConverter.class)
    private Map<String, Object> programFields = new HashMap<>();

    @ManyToOne
    private Instance instances;

    public Long getId() { return id; }
    public String getUuid() { return uuid; }
    public String getProgramId() { return programId; }
    public void setProgramId(String programId) { this.programId = programId; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public String getDisplayShortName() { return displayShortName; }
    public void setDisplayShortName(String displayShortName) { this.displayShortName = displayShortName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Map<String, Object> getProgramStageSections() { return programStageSections; }
    public void setProgramStageSections(Map<String, Object> programStageSections) { this.programStageSections = programStageSections; }
    public Map<String, Object> getProgramFields() { return programFields; }
    public void setProgramFields(Map<String, Object> programFields) { this.programFields = programFields; }
    public Instance getInstances() { return instances; }
    public void setInstances(Instance instances) { this.instances = instances; }

    public Map<String, Object> toMap() {
        Map<String, Object> programMap = new HashMap<>();
        programMap.put("id", this.getId());
        programMap.put("uuid", this.getUuid());
        programMap.put("programId", this.getProgramId());
        programMap.put("displayName", this.getDisplayName());
        programMap.put("displayShortName", this.getDisplayShortName());
        programMap.put("description", this.getDescription());
        programMap.put("programStageSections", this.getProgramStageSections());
        programMap.put("programFields", this.getProgramFields());
        return programMap;
    }
}

