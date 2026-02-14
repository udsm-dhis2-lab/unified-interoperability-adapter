package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Role;
import com.Adapter.icare.Domains.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RoleRepository extends JpaRepository<Role,String> {
    @Query(value = "SELECT * FROM roles r WHERE r.uuid =:uuid", nativeQuery = true)
    Role findByUuid(String uuid);

    @Query(value = "SELECT * FROM roles r WHERE r.role_name =:name", nativeQuery = true)
    Role findByName(String name);


    @Query(value = "SELECT * FROM roles u " +
            "WHERE :search IS NULL OR (role_name LIKE CONCAT('%', :search, '%')" +
            "OR description LIKE CONCAT('%', :search, '%'))",
            countQuery = "SELECT * FROM roles u " +
                    "WHERE :search IS NULL OR (role_name LIKE CONCAT('%', :search, '%')" +
                    "OR description LIKE CONCAT('%', :search, '%'))",
            nativeQuery = true)
    Page<Role> findAllRoles(Pageable pageable, @Param("search") String search);
}
