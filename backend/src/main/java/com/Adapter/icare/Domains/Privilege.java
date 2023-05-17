package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.parameters.P;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

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

        return privilege;
    }

    public Map<String,Object> toMap(){
        Map<String,Object> privilegeMap = new HashMap<>();
        if(this.getPrivilegeName() != null){
            privilegeMap.put("privilegeName",this.getPrivilegeName());
        }

        if(this.getDescription() != null){
            privilegeMap.put("description",this.getDescription());
        }

        return privilegeMap;
    }

}
