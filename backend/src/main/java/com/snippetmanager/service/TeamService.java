package com.snippetmanager.service;

import com.snippetmanager.model.Team;
import com.snippetmanager.model.User;
import com.snippetmanager.repository.TeamRepository;
import com.snippetmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username).orElse(null);
    }

    public Team createTeam(Team team) {
        User currentUser = getCurrentUser();
        if (currentUser == null) throw new RuntimeException("Not authenticated");

        team.setCreatorId(currentUser.getId());
        if (team.getMemberIds() == null) team.setMemberIds(new ArrayList<>());
        if (!team.getMemberIds().contains(currentUser.getId())) {
            team.getMemberIds().add(currentUser.getId());
        }
        
        Team savedTeam = teamRepository.save(team);
        
        // Update user's team list
        if (currentUser.getTeamIds() == null) currentUser.setTeamIds(new ArrayList<>());
        currentUser.getTeamIds().add(savedTeam.getId());
        userRepository.save(currentUser);
        
        return savedTeam;
    }

    public List<Team> getMyTeams() {
        User currentUser = getCurrentUser();
        if (currentUser == null) return new ArrayList<>();
        return teamRepository.findByMemberIdsContaining(currentUser.getId());
    }

    public Team addMember(String teamId, String userId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        User currentUser = getCurrentUser();
        if (!team.getCreatorId().equals(currentUser.getId())) {
            throw new RuntimeException("Only creator can add members");
        }

        if (!team.getMemberIds().contains(userId)) {
            team.getMemberIds().add(userId);
            teamRepository.save(team);
            
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            if (user.getTeamIds() == null) user.setTeamIds(new ArrayList<>());
            user.getTeamIds().add(teamId);
            userRepository.save(user);
        }
        return team;
    }
}
