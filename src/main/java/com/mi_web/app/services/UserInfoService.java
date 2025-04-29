package com.mi_web.app.services;

import com.mi_web.app.models.UserInfo;
import com.mi_web.app.repositories.UserInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserInfoService {

    private final UserInfoRepository userInfoRepository;

    public UserInfo getUserInfoByUserId(Long userId) {
        return userInfoRepository.findByUserId(userId).orElse(null);
    }
}
