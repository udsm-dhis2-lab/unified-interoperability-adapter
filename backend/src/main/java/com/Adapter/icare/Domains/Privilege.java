package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.parameters.P;

import javax.persistence.*;
import java.util.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "privileges")
public class Privilege extends BaseEntity {
    @Id
    @Column(name = "privilege_name",length = 50)
    private String privilegeName;
    private String description;

    @ManyToMany(mappedBy = "privileges", fetch = FetchType.LAZY)
    private Set<Role> roles;

    public static Privilege fromMap(Map<String, Object> privilegeMap){
        Privilege privilege = new Privilege();
        if(privilegeMap.get("privilegeName") != null){
            privilege.setPrivilegeName(privilegeMap.get("privilegeName").toString());
        }

        if(privilegeMap.get("description") != null){
            privilege.setDescription(privilegeMap.get("description").toString());
        }

        if(privilegeMap.get("sharing") != null){
            privilege.setSharing(privilegeMap.get("sharing").toString());
        }

        return privilege;
    }

    public Map<String,Object> toMap(Boolean withRoles){
        Map<String,Object> privilegeMap = new HashMap<>();
        privilegeMap.put("uuid",this.getUuid());
        if(this.getPrivilegeName() != null){
            privilegeMap.put("privilegeName",this.getPrivilegeName());
        }

        if(this.getDescription() != null){
            privilegeMap.put("description",this.getDescription());
        }
        if(this.getSharing() != null){
            privilegeMap.put("sharing", this.getSharing());
        }

        if(withRoles){
            if(this.getRoles() != null) {
                List<Map<String, Object>> rolesMap = new ArrayList<>();
                for (Role role : this.getRoles()) {
                    rolesMap.add(role.toMap(false));
                }
                privilegeMap.put("roles",rolesMap);
            }

        }

        return privilegeMap;
    }

}
