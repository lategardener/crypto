package lategardener.crypto.service;

import lategardener.crypto.model.Profile;
import lategardener.crypto.model.User;
import lategardener.crypto.repository.ProfileRepository;
import lategardener.crypto.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

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

    public void createUserProfile(User user){
        Profile profile = new Profile();
        profile.setUser(user);
        // Générer un nombre aléatoire entre 0 et 199
        Random random = new Random();
        int randomNumber = random.nextInt(200);

        // Formater le nombre à 4 chiffres
        String formattedNumber = String.format("%04d", randomNumber);

        // Construire le nom du fichier
        String fileName = "CryptoFluff_" + formattedNumber + ".jpg";
        profile.setAvatar(fileName);

        profileRepository.save(profile);
    }

    public Profile getprofile(Long userId){
        Optional<Profile> profile = profileRepository.getProfile(userId);
        if (profile.isPresent()){
            return profile.get();
        }
        return new Profile();
    }

    public List<Profile> getAllProfile(){
        return profileRepository.findAll();
    }


}
