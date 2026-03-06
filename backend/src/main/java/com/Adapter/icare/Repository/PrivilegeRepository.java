package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PrivilegeRepository extends JpaRepository<Privilege, String> {
    Privilege findByUuid(String uuid);

    @Query("SELECT p FROM Privilege p LEFT JOIN FETCH p.roles WHERE p.uuid = :uuid")
    Optional<Privilege> findByUuidWithRoles(@Param("uuid") String uuid);

    @Query(value = "SELECT * FROM privileges pr WHERE pr.privilege_name =:name ", nativeQuery = true)
    Privilege findByName(String name);
}
