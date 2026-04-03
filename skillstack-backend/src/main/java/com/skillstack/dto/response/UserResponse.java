package com.skillstack.dto.response;

import com.skillstack.entity.User;
import com.skillstack.entity.UserSettings;

public class UserResponse {
    public Long id;
    public String name;
    public String email;
    public String role;
    // settings (nullable)
    public String bio;
    public String location;
    public String roleTitle;
    public boolean isPublic;

    public static UserResponse from(User user) {
        UserResponse r = new UserResponse();
        r.id       = user.getId();
        r.name     = user.getName();
        r.email    = user.getEmail();
        r.role     = user.getRole().name();

        UserSettings s = user.getSettings();
        if (s != null) {
            r.bio       = s.getBio();
            r.location  = s.getLocation();
            r.roleTitle = s.getRoleTitle();
            r.isPublic  = s.isPublic();
        } else {
            r.isPublic = true;
        }
        return r;
    }
}
