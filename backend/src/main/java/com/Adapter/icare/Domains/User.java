package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "users")
public class User extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="userid")
    private Long id;
    private String username;
    private String password;
    private String email;
    private String phonenumber;
    private String surname;
    private String middlename;
    private String firstname;
    private Boolean externalauth;
    private Date passwordlastupdated;
    private Date lastlogin;
    private String restoretoken;
    private Date restoreexpiry;
    private Boolean disabled;
    private Date accountexpiry;
}
