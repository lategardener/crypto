package lategardener.crypto.service;

import lategardener.crypto.model.Profile;
import lategardener.crypto.model.User;
import lategardener.crypto.repository.ProfileRepository;
import lategardener.crypto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfileService {
    @Autowired
    private ProfileRepository profileRepository;
    @Autowired
    private UserRepository userRepository;

    public void updateProfile(Profile profile, Long user_id){
        User user = userRepository.findById(user_id).orElseThrow(
                () -> new IllegalStateException("this user do not exists")
        );
        profile.setUser(user);
        profileRepository.save(profile);
    }

    public List<Profile> getAllProfile(){
        return profileRepository.findAll();
    }


}
