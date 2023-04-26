package com.Adapter.icare.Domains;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@MappedSuperclass
public class BaseEntity implements Serializable {
    @GeneratedValue(generator = "UUID")
    @Column(columnDefinition = "BINARY(16)", updatable = false, nullable = false)
    private UUID uuid;
    private Date createdon;
    private Integer createdby;
    private Date lastupdatedon;
    private Integer lastupdatedby;
    private Boolean retired;
}
