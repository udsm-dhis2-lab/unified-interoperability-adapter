package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.DataFormatException;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "validators")
public class DynamicValidator extends BaseEntity {
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

    @Column()
    private Boolean published = false;


    public DynamicValidator fromMap(Map<String, Object> validatorMap) throws DataFormatException {

        if(validatorMap.get("name") == null || validatorMap.get("ruleExpression") == null || validatorMap.get("errorMessage") == null){
            throw new DataFormatException("Validator must have name, rule expression and error message!");
        }

        DynamicValidator dynamicValidator = new DynamicValidator();

        if(validatorMap.get("uuid") != null){
            dynamicValidator.setUuid(validatorMap.get("uuid").toString());
        }

        dynamicValidator.setName(validatorMap.get("name").toString());
        dynamicValidator.setErrorMessage(validatorMap.get("errorMessage").toString());
        dynamicValidator.setRuleExpression(validatorMap.get("ruleExpression").toString());

        if(validatorMap.get("code") != null){
            dynamicValidator.setCode(validatorMap.get("code").toString());
        }

        if(validatorMap.get("description") != null){
            dynamicValidator.setDescription(validatorMap.get("description").toString());
        }

        if(validatorMap.get("published") != null){
            dynamicValidator.setPublished((Boolean) validatorMap.get("published"));
        } else {
            dynamicValidator.setPublished(false);
        }

        return dynamicValidator;
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

        if (this.getPublished() != null) {
            validatorMap.put("published", this.getPublished());
        } else {
            validatorMap.put("published", false);
        }
        validatorMap.put("lastUpdatedOn", this.getLastUpdatedOn());
        validatorMap.put("lastUpdatedBy", lastUpdatedBy);

        return validatorMap;
    }

}
