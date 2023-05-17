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
@Table(name = "group_tbl")
public class Group extends BaseEntity {

    @Id
    @Column(name = "group_name")
    private String groupName;
    private String description;

    @ManyToMany(mappedBy = "groups", fetch = FetchType.LAZY)
    private Set<User> users;
}
