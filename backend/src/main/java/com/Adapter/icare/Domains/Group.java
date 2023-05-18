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
@Table(name = "groups")
public class Group extends BaseEntity {

    @Id
    @Column(name = "group_name")
    private String groupName;
    private String description;

    @ManyToMany(mappedBy = "groups", fetch = FetchType.LAZY)
    private Set<User> users;

    public static Group fromMap(Map<String,Object> groupMap){
        Group group = new Group();
        if(groupMap.get("groupName") != null){
            group.setGroupName(groupMap.get("groupName").toString());
        }

        if(groupMap.get("description") != null){
            group.setDescription(groupMap.get("description").toString());
        }

        if(groupMap.get("sharing") != null){
            group.setSharing(groupMap.get("sharing").toString());
        }

        return group;

    }

    public Map<String,Object> toMap(Boolean withUSers){
        Map<String,Object> groupMap = new HashMap<>();
        groupMap.put("uuid",this.getUuid());
        if(this.getGroupName() != null){
            groupMap.put("groupName",this.getGroupName());
        }
        if(this.getDescription() != null){
            groupMap.put("description",this.getDescription());
        }
        if(this.getSharing() != null){
            groupMap.put("sharing", this.getSharing());
        }

        if(withUSers){
            if(this.getUsers() != null) {
                List<Map<String, Object>> usersMap = new ArrayList<>();
                for(User user : this.getUsers()){
                    usersMap.add(user.toMap());
                }
                groupMap.put("users",usersMap);
            }
        }
        return groupMap;
    }
}
