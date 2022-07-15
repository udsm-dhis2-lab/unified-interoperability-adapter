package com.Adapter.icare.Domains;

import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
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
public class Datasets implements Serializable {

    @Id
    //@GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;
    private String displayName;

    @Lob
    private String FormdesignCode;
    
    @ManyToOne
    private Instances instances;
    
}
