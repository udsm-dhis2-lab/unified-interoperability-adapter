package com.Adapter.icare.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.Adapter.icare.Domains.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "SELECT * FROM users u WHERE u.username=:username", nativeQuery = true)
    User findByUsername(String username);

    @Query(value = "SELECT * FROM users u WHERE u.uuid =:uuid ", nativeQuery = true)
    User findByUuid(String uuid);
}
