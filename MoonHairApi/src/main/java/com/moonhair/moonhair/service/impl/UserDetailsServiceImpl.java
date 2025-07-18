package com.moonhair.moonhair.service.impl;

import com.moonhair.moonhair.entities.EmployeeEntity;
import com.moonhair.moonhair.repositories.EmployeeRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final EmployeeRepository employeeRepository;

    public UserDetailsServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        EmployeeEntity user = employeeRepository.findByUsernameAndActiveIsTrue(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        List<SimpleGrantedAuthority> authorities = Arrays.stream(user.getRoles().split(","))
                .map(String::trim)
                .map(SimpleGrantedAuthority::new)
                .toList();
        return new User(user.getUsername(), user.getPassword(), authorities);
    }

//    public UserEntity registerUser(String username, String password) {
//        if (userRepository.findByUsername(username).isPresent()) {
//            throw new RuntimeException("User already exists");
//        }
//        UserEntity user = new UserEntity(null, username, passwordEncoder.encode(password), "USER");
//        return userRepository.save(user);
//    }
}

