package com.agroconnect.backend.controller;

import com.agroconnect.backend.model.UserProfile;
import com.agroconnect.backend.service.UserService;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String uid = (String) auth.getPrincipal();

        String email = null;
        String displayName = null;
        String photoUrl = null;

        // Extract Firebase token details stored as credentials
        if (auth instanceof UsernamePasswordAuthenticationToken upat) {
            Object credentials = upat.getCredentials();
            if (credentials instanceof FirebaseToken token) {
                email = token.getEmail();
                displayName = token.getName();
                photoUrl = token.getPicture();
            }
        }

        UserProfile profile = userService.getOrCreateUser(uid, email, displayName, photoUrl);
        return ResponseEntity.ok(profile);
    }
}
