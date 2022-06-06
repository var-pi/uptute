package com.uptute.backend.services.account;

import javax.transaction.Transactional;

import com.uptute.backend.domain.UserDetailsImpl;
import com.uptute.backend.repositories.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

    @Autowired
    UserRepository repository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var acc = repository.findByUUID(username).orElseThrow(() -> new UsernameNotFoundException("Account Not Found with UUID: " + username));
        return UserDetailsImpl.build(acc);
    }
    
}
