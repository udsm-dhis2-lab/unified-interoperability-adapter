package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RoleRepository extends JpaRepository<Role,String> {
    @Query(value = "SELECT * FROM roles r WHERE r.uuid =:uuid", nativeQuery = true)
    Role findByUuid(String uuid);
}
