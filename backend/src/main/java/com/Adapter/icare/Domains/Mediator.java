package com.Adapter.icare.Domains;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table

public class Mediator  extends BaseEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String baseUrl;
    private String path;

    @Column(name = "auth_token", nullable = true)
    private String authToken;

    @Column(name = "auth_type", nullable = true)
    private String authType;

    public enum AuthType{
        BASIC("BASIC"),
        TOKEN("TOKEN");
        final String value;

        AuthType(String value){
            this.value = value;
        }

        public String getValue(){
            return value;
        }
    }
}
