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
@Table(name = "groups")
public class Group extends BaseEntity {

    @Id
    @Column(name = "group_name")
    private String groupName;
    private String description;

    @ManyToMany(mappedBy = "groups", fetch = FetchType.LAZY)
    private Set<User> users;

    public Map<String,Object> toMap(){
        Map<String,Object> groupMap = new HashMap<>();
        if(this.getGroupName() != null){
            groupMap.put("groupName",this.getGroupName());
        }
        if(this.getDescription() != null){
            groupMap.put("description",this.getDescription());
        }
        return groupMap;
    }
}
