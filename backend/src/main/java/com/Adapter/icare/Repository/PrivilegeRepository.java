package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Privilege;
import com.Adapter.icare.Domains.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface PrivilegeRepository extends JpaRepository<Privilege, String> {
    Privilege findByUuid(String uuid);

    @Query(value = "SELECT * FROM privileges pr WHERE pr.privilege_name =:name ", nativeQuery = true)
    Privilege findByName(String name);
}
