package com.Adapter.icare.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Adapter.icare.Domains.User;

import java.util.List;
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
