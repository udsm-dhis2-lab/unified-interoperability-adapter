package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import scala.math.BigInt;

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
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    @Column(name="userid")
    private Integer id;
    @Column(unique = true)
    private String username;
    @Column()
    private String password;

    @Column(unique = true)
    private String email;

    @Column()
    private String phonenumber;
    @Column()
    private String surname;

    @Column()
    private String middlename;
    @Column()
    private String firstname;

//    @Column()
//    private Boolean externalauth;
//
//    @Column()
//    private Date passwordlastupdated;
//
//    @Column()
//    private Date lastlogin;
//
//    @Column()
//    private String restoretoken;
//
//    @Column()
//    private Date restoreexpiry;

    @Column()
    private Boolean disabled;

//    @Column()
//    private Date accountexpiry;
}


