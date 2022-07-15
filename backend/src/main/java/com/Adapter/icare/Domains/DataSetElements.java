package com.Adapter.icare.Domains;

import java.io.Serializable;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.annotation.Transient;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table
public class DataSetElements {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dataElement;
    private String categoryOptionCombo;
    private String SqlQuery;
    @ManyToOne
    private Datasets datasets;

    @ManyToOne
    private Datasource datasource;

    @Transient
    private String dataElementCategoryOptionCombo;

    
    

}
