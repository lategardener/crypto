package lategardener.crypto.controller;


import lategardener.crypto.model.Profile;
import lategardener.crypto.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @PutMapping(path = "/api/update/{user_id}")
    @ResponseBody
    public void upadateProfile(@RequestBody Profile profile, @PathVariable ("user_id") Long user_id){
        profileService.updateProfile(profile, user_id);
    }

    @GetMapping(path = "/api/getAll")
    @ResponseBody
    public List<Profile> fetAllProfile(){
        return profileService.getAllProfile();
    }
}
