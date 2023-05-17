package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "roles")
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

    public static Role fromMap(Map<String,Object> roleMap){
        Role role = new Role();
        if(roleMap.get("roleName") != null){
            role.setRoleName(roleMap.get("roleName").toString());
        }

        if(roleMap.get("description") != null){
            role.setDescription(roleMap.get("description").toString());
        }

        return role;
    }

    public Map<String,Object> toMap(){
        Map<String,Object> roleMap = new HashMap<>();
        if(this.getRoleName() != null){
            roleMap.put("roleName",this.getRoleName());
        }

        if(this.getDescription() != null){
            roleMap.put("description",this.getDescription());
        }

        return roleMap;
    }
}
