package com.snippetmanager.controller;

import com.snippetmanager.model.Team;
import com.snippetmanager.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        return ResponseEntity.ok(teamService.createTeam(team));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Team>> getMyTeams() {
        return ResponseEntity.ok(teamService.getMyTeams());
    }

    @PostMapping("/{teamId}/members/{userId}")
    public ResponseEntity<Team> addMember(@PathVariable String teamId, @PathVariable String userId) {
        return ResponseEntity.ok(teamService.addMember(teamId, userId));
    }
}
