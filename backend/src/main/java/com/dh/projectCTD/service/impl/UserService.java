package com.dh.projectCTD.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dh.projectCTD.dto.UserDTO;
import com.dh.projectCTD.exception.ResourceNotFoundException;
import com.dh.projectCTD.model.Role;
import com.dh.projectCTD.model.User;
import com.dh.projectCTD.repository.IUserRepository;
import com.dh.projectCTD.service.IUserService;

@Service

public class UserService implements IUserService {

    private IUserRepository userRepository;

    @Autowired
    public UserService(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Get all users
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserDTO> usersDtos = new ArrayList<>();

        for (User user : users ) {
            usersDtos.add(new UserDTO(
                user.getId(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getRole().toString()
            ));
        }

        return usersDtos;
    }

    // Get user by id
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        UserDTO userDto = new UserDTO();
        userDto.setUserId(id);
        userDto.setFirstName(user.getFirstname());
        userDto.setLastName(user.getLastname());
        userDto.setEmail(user.getEmail());
        userDto.setRole(user.getRole().toString());

        return userDto;
    }

    public UserDTO save(UserDTO dto) throws Exception{
        if (userRepository.findByEmail(dto.getEmail()).isEmpty()) {
            throw new BadRequestException("User email already exists!");
        }

        User user = new User();
        user.setFirstname(dto.getFirstName());
        user.setLastname(dto.getLastName());
        user.setEmail(dto.getEmail());

        Role role = dto.getRole() == "ADMIN" ? Role.ROLE_ADMIN : Role.ROLE_USER;
        user.setRole(role);

        User savedUser = userRepository.save(user);

        UserDTO dtoToReturn = new UserDTO();
        dtoToReturn.setFirstName(savedUser.getFirstname());
        dtoToReturn.setLastName(savedUser.getLastname());
        dtoToReturn.setEmail(savedUser.getEmail());
        dtoToReturn.setRole(savedUser.getRole().toString());

        return dtoToReturn;
        
    }

    // Set user role
    public UserDTO setUserRole(Long id, String role) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found!"));
        
        if (Role.valueOf(role) == null) {
            throw new ResourceNotFoundException("Role not found!");
        }
        
        user.setRole(Role.valueOf(role));
        User savedUser = userRepository.save(user);

        UserDTO dto = new UserDTO();
        dto.setFirstName(savedUser.getFirstname());
        dto.setLastName(savedUser.getLastname());
        dto.setEmail(savedUser.getEmail());
        dto.setRole(savedUser.getRole().toString());
        return dto;
    }

    public void deleteUser(Long id) {
        userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User id not found"));
        userRepository.deleteById(id);
    }
}
