package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import scala.math.BigInt;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.Adapter.icare.Utils.RoleDeserializer;
import com.Adapter.icare.Utils.GroupDeserializer;

import javax.persistence.*;
import java.io.Serializable;
import java.util.*;
import java.util.stream.Collectors;

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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role",
    joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "role_name", referencedColumnName = "role_name")
    })
    private Set<Role> roles;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name="user_group",
    joinColumns = {
            @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    },
    inverseJoinColumns = {
            @JoinColumn(name = "group_name", referencedColumnName = "group_name")
    })
    private Set<Group> groups;


    public static User fromMap(Map<String,Object> userMap){
        User user = new User();

        if(userMap.get("uuid") != null){
            user.setUuid(userMap.get("uuid").toString());
        }
        if(userMap.get("username") != null){
            user.setUsername(userMap.get("username").toString());
        }
        if(userMap.get("firstName") != null){
            user.setFirstName(userMap.get("firstName").toString());
        }
        if(userMap.get("middleName") != null){
            user.setMiddleName(userMap.get("middleName").toString());
        }
        if(userMap.get("surname") != null){
            user.setSurname(userMap.get("surname").toString());
        }
        if(userMap.get("email") != null){
            user.setEmail(userMap.get("email").toString());
        }
        if(userMap.get("phoneNumber") != null){
            user.setPhoneNumber(userMap.get("phoneNumber").toString());
        }
        if(userMap.get("password") != null){
            user.setPassword(userMap.get("password").toString());
        }
        if(userMap.get("disabled") != null){
            user.setDisabled((Boolean) userMap.get("disabled"));
        }
        if(userMap.get("externalAuth") != null){
            user.setExternalAuth((Boolean) userMap.get("externalAuth"));
        }

        // Populate roles
        if (userMap.get("roles") instanceof List) {
            List<?> rolesList = (List<?>) userMap.get("roles");
            Set<Role> roles = rolesList.stream()
                .map(roleItem -> {
                    Role role = new Role();
                    if (roleItem instanceof String) {
                        // If it's a UUID string
                        role.setUuid(roleItem.toString());
                    } else if (roleItem instanceof Map) {
                        // If it's a role object
                        Map<String, Object> roleMap = (Map<String, Object>) roleItem;
                        if (roleMap.get("uuid") != null) {
                            role.setUuid(roleMap.get("uuid").toString());
                        }
                        if (roleMap.get("roleName") != null) {
                            role.setRoleName(roleMap.get("roleName").toString());
                        }
                        if (roleMap.get("description") != null) {
                            role.setDescription(roleMap.get("description").toString());
                        }
                    }
                    return role;
                })
                .filter(role -> role.getUuid() != null) // Only include roles with UUID
                .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        // Populate groups
        if (userMap.get("groups") instanceof List) {
            List<?> groupsList = (List<?>) userMap.get("groups");
            Set<Group> groups = groupsList.stream()
                .map(groupItem -> {
                    Group group = new Group();
                    if (groupItem instanceof String) {
                        // If it's a UUID string
                        group.setUuid(groupItem.toString());
                    } else if (groupItem instanceof Map) {
                        // If it's a group object
                        Map<String, Object> groupMap = (Map<String, Object>) groupItem;
                        if (groupMap.get("uuid") != null) {
                            group.setUuid(groupMap.get("uuid").toString());
                        }
                        if (groupMap.get("groupName") != null) {
                            group.setGroupName(groupMap.get("groupName").toString());
                        }
                        if (groupMap.get("description") != null) {
                            group.setDescription(groupMap.get("description").toString());
                        }
                    }
                    return group;
                })
                .filter(group -> group.getUuid() != null) // Only include groups with UUID
                .collect(Collectors.toSet());
            user.setGroups(groups);
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
        List authorities = new ArrayList<String>();
        if(this.getRoles() != null){
            List<Map<String,Object>> rolesMap = new ArrayList<>();
            for( Role role : this.getRoles()){
                rolesMap.add(role.toMap(false));
                // Get privileges
                for (Privilege privilege: role.getPrivileges()) {
                    authorities.add(privilege.getPrivilegeName());
                }
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
        userMap.put("authorities",authorities);
        return userMap;
    }

    public Map<String, Object> getReferencedProperties() {
        Map<String,Object> userMappedProperties = new HashMap<>();
        userMappedProperties.put("uuid", this.getUuid());
        String displayName = "";
        if (this.getFirstName() != null) {
            displayName.concat(this.getFirstName()).concat(" ");
        }
        if (this.getSurname() != null) {
            displayName.concat(this.getSurname());
        }
        userMappedProperties.put("displayName", displayName);
        return userMappedProperties;
    }
}


