package com.Adapter.icare.Repository;

import com.Adapter.icare.Domains.Group;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, String> {
    Group findByUuid(String uuid);
}
