package com.dh.projectCTD.service;

import java.util.List;

import com.dh.projectCTD.dto.UserDTO;

public interface IUserService {
    public List<UserDTO> getAllUsers();
    public UserDTO getUserById(Long id);
    public UserDTO setUserRole(Long id, String role);
    public void deleteUser(Long id);
}
