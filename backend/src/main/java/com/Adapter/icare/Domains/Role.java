package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.*;

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

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
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
        if(roleMap.get("sharing") != null){
            role.setSharing(roleMap.get("sharing").toString());
        }
        return role;
    }

    public Map<String,Object> toMap(Boolean withPrivileges){
        Map<String,Object> roleMap = new HashMap<>();

        roleMap.put("uuid",this.getUuid());
        if(this.getRoleName() != null){
            roleMap.put("roleName",this.getRoleName());
        }

        if(this.getDescription() != null){
            roleMap.put("description",this.getDescription());
        }

        if(withPrivileges) {
            if (this.getPrivileges() != null) {
                List<Map<String, Object>> priviligesMap = new ArrayList<>();
                for (Privilege privilege : this.getPrivileges()) {
                    priviligesMap.add(privilege.toMap(false));
                }
                roleMap.put("privileges", priviligesMap);
            }
        }

        if(this.getSharing() != null){
            roleMap.put("sharing", this.getSharing());
        }

        return roleMap;
    }
}
