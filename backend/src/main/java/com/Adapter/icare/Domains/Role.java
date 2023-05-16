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
@Table(name = "role")
public class Role extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role")
    private String role;
    private String description;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "role_privilege",
    joinColumns = {
            @JoinColumn(name = "role", referencedColumnName = "role")
    },
    inverseJoinColumns = {
            @JoinColumn(name="privilege",referencedColumnName = "privilege")
    })
    private Set<Privilege> privileges;
}
