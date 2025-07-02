package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "validators")
public class Validator extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name="validator_id")
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    private String code;

    @Column(columnDefinition = "TEXT")
    private String ruleExpression;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column()
    private String errorMessage;


    public Validator fromMap(Map<String, Object> validatorMap){
        Validator validator = new Validator();

        if(validatorMap.get("uuid") != null){
            validator.setUuid(validatorMap.get("uuid").toString());
        }

        if(validatorMap.get("name") != null){
            validator.setName(validatorMap.get("name").toString());
        }

        if(validatorMap.get("ruleExpression") != null){
            validator.setRuleExpression(validatorMap.get("ruleExpression").toString());
        }

        if(validatorMap.get("code") != null){
            validator.setCode(validatorMap.get("code").toString());
        }

        if(validatorMap.get("errorMessage") != null){
            validator.setErrorMessage(validatorMap.get("errorMessage").toString());
        }

        if(validatorMap.get("description") != null){
            validator.setDescription(validatorMap.get("description").toString());
        }

        return validator;
    }

    public Map<String, Object> toMap(){
        Map<String, Object> validatorMap = new HashMap<String, Object>();

        if(this.getUuid() != null){
            validatorMap.put("uuid", this.getUuid());
        }

        if(this.getName() != null){
            validatorMap.put("name", this.getName());
        }

        if(this.getRuleExpression() != null){
            validatorMap.put("ruleExpression", this.getRuleExpression());
        }

        if(this.getCode() != null){
            validatorMap.put("code", this.getCode());
        }

        if(this.getErrorMessage() != null){
            validatorMap.put("errorMessage", this.getErrorMessage());
        }

        if(this.getDescription() != null){
            validatorMap.put("description", this.getDescription());
        }

        Map<String, Object> createdBy = new HashMap<>();
        if (this.getCreatedBy() != null) {
            createdBy.put("uuid", this.getCreatedBy().getUuid());
            createdBy.put("username", this.getCreatedBy().getUsername());
            createdBy.put("names", this.getCreatedBy().getFirstName() + " " + this.getCreatedBy().getSurname());
        } else {
            createdBy = null;
        }
        validatorMap.put("createdBy",createdBy);

        Map<String, Object> lastUpdatedBy = new HashMap<>();
        if (this.getLastUpdatedBy() != null) {
            lastUpdatedBy.put("uuid", this.getLastUpdatedBy().getUuid());
            lastUpdatedBy.put("username", this.getLastUpdatedBy().getUsername());
            lastUpdatedBy.put("names", this.getLastUpdatedBy().getFirstName() + " " + this.getLastUpdatedBy().getSurname());
        } else {
            lastUpdatedBy = null;
        }
        validatorMap.put("lastUpdatedOn", this.getLastUpdatedOn());
        validatorMap.put("lastUpdatedBy",lastUpdatedBy);

        return validatorMap;
    }

}
