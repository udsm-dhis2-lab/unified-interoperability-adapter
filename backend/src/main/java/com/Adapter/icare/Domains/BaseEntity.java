package com.Adapter.icare.Domains;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

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
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(name = "uuid", updatable = false, nullable = false)
    private UUID uuid;

    @CreationTimestamp
    private Date createdon;

    @Column()
    private User createdby;

    @Column()
    private Date lastupdatedon;

    @Column()
    private User lastupdatedby;

    @Column()
    private Boolean retired;
    @Column()
    private User retiredby;
}
