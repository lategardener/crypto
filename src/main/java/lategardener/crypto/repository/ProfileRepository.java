package lategardener.crypto.repository;

import lategardener.crypto.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    @Query(value = "select * from profile where user_id=?", nativeQuery = true)
    Optional<Profile> getProfile(Long id);
}
