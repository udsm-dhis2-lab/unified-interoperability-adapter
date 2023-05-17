package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role,String> {
}
