package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "role_tbl")
public class Role extends BaseEntity{

    @Id
    @Column(name = "role_name", length = 50)
    private String roleName;
    private String description;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "role_privilege",
    joinColumns = {
            @JoinColumn(name = "role_name", referencedColumnName = "role_name")
    },
    inverseJoinColumns = {
            @JoinColumn(name="privilege_name",referencedColumnName = "privilege_name")
    })
    private Set<Privilege> privileges;

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private Set<User> users;
}
