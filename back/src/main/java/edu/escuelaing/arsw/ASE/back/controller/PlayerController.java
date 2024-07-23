package edu.escuelaing.arsw.ASE.back.controller;

import edu.escuelaing.arsw.ASE.back.model.Player;
import edu.escuelaing.arsw.ASE.back.service.PlayerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/players")
@CrossOrigin(origins = "*")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @GetMapping("/top5")
    public List<Player> getTop5Players() {
        return playerService.findTop5ByScore();
    }

}
