package com.agroconnect.backend.service;

import com.agroconnect.backend.model.User;
import com.agroconnect.backend.model.UserProfile;
import com.agroconnect.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfile getOrCreateUser(String uid, String email, String displayName, String photoUrl) {
        User user = userRepository.findById(uid).orElse(null);

        if (user == null) {
            user = new User(uid, email, displayName, photoUrl);
            user = userRepository.save(user);
        } else {
            // Update mutable fields
            boolean changed = false;
            if (email != null && !email.equals(user.getEmail())) {
                user.setEmail(email);
                changed = true;
            }
            if (displayName != null && !displayName.equals(user.getDisplayName())) {
                user.setDisplayName(displayName);
                changed = true;
            }
            if (photoUrl != null && !photoUrl.equals(user.getPhotoUrl())) {
                user.setPhotoUrl(photoUrl);
                changed = true;
            }
            if (changed) {
                user = userRepository.save(user);
            }
        }

        Instant createdAt = user.getCreatedAt() != null ? user.getCreatedAt() : Instant.now();
        return new UserProfile(user.getId(), user.getEmail(), user.getDisplayName(), user.getPhotoUrl(), createdAt);
    }
}
