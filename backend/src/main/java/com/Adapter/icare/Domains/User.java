package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import scala.math.BigInt;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;

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


    private static User fromMap(Map<String,Object> userMap){
        User user = new User();

        if(userMap.get("uuid") != null){
            user.setUuid((UUID) userMap.get("uuid"));
        }
        if(userMap.get("username") != null){
            user.setUsername(userMap.get("username").toString());
        }
        if(userMap.get("email") != null){
            user.setEmail(userMap.get("email").toString());
        }
        if(userMap.get("phoneNumber") != null){
            user.setPhoneNumber(userMap.get("phoneNumber").toString());
        }
        if(userMap.get("surname") != null){
            user.setSurname(userMap.get("surname").toString());
        }
        return user;
    }

    public Map<String,Object> toMap(){

        Map<String,Object> userMap = new HashMap<>();
        userMap.put("uuid",this.getUuid());

        if(this.getUsername() != null){
            userMap.put("username", this.getUsername());
        }
        if(this.getEmail() != null){
            userMap.put("email", this.getEmail());
        }
        if(this.getPhoneNumber() != null){
            userMap.put("phoneNumber", this.getPhoneNumber());
        }
        if(this.getSurname() != null){
            userMap.put("surname",this.getSurname());
        }
        if(this.getMiddleName() != null){
            userMap.put("middleName",this.getMiddleName());
        }
        if(this.getFirstName() != null){
            userMap.put("firstName",this.getFirstName());
        }
        if(this.getExternalAuth() == null){
            userMap.put("externalAuth",this.getExternalAuth());
        }
        if(this.getPasswordLastUpdated() != null){
            userMap.put("passwordLastUpdated", this.getPasswordLastUpdated());
        }
        if(this.getLastLogin() != null){
            userMap.put("lastLogin", this.getLastLogin());
        }
        if(this.getRestoreToken() != null){
            userMap.put("restoreToken", this.getRestoreToken());
        }
        if(this.getRestoreExpiry() != null){
            userMap.put("restoreExpiry",this.getRestoreExpiry());
        }
        if(this.getDisabled() != null){
            userMap.put("disabled", this.getDisabled());
        }
        if(this.getAccountExpiry() != null){
            userMap.put("accountExpiry",this.getAccountExpiry());
        }
        if(this.getRoles() != null){
            List<Map<String,Object>> rolesMap = new ArrayList<>();
            for( Role role : this.getRoles()){
                rolesMap.add(role.toMap(false));
            }
            userMap.put("roles",rolesMap);
        }

        if(this.getGroups() != null){
            List<Map<String,Object>> groupsMap = new ArrayList<>();
            for(Group group : this.getGroups()){
                groupsMap.add(group.toMap(false));
            }
            userMap.put("groups",groupsMap);
        }

        if(this.getSharing() != null){
            userMap.put("sharing",this.getSharing());
        }
        return userMap;
    }
}


