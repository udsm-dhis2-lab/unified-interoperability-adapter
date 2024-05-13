package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Privilege;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrivilegeRepository extends JpaRepository<Privilege, String> {
    Privilege findByUuid(String uuid);
}
