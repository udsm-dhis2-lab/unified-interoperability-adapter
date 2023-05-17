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
import java.util.Set;
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
    @Column(name="user_id")
    private Integer id;
    @Column(unique = true)
    private String username;
    @Column()
    private String password;

    @Column(unique = true)
    private String email;

    @Column()
    private String phoneNumber;
    @Column()
    private String surname;

    @Column()
    private String middleName;
    @Column()
    private String firstName;

    @Column()
    private Boolean externalAuth;

    @Column()
    private Date passwordLastUpdated;

    @Column()
    private Date lastLogin;

    @Column()
    private String restoreToken;

    @Column()
    private Date restoreExpiry;

    @Column()
    private Boolean disabled;

    @Column()
    private Date accountExpiry;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name = "user_role",
    joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "role_name", referencedColumnName = "role_name")
    })
    private Set<Role> roles;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(name="user_group",
    joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "group_name", referencedColumnName = "group_name")
    })
    private Set<Group> groups;
}


