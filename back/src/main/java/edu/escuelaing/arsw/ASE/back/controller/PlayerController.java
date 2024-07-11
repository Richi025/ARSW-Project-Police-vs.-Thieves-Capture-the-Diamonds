package edu.escuelaing.arsw.ASE.back.controller;

import edu.escuelaing.arsw.ASE.back.model.Player;
import edu.escuelaing.arsw.ASE.back.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/games/{gameId}/players")
public class PlayerController {
    @Autowired
    private PlayerService playerService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public List<Player> getAllPlayers(@PathVariable String gameId) {
        return playerService.getAllPlayers(gameId);
    }

    @PostMapping
    public Player createPlayer(@PathVariable String gameId, @RequestBody Player player) {
        player.setGameId(gameId); // Establecer el gameId
        Player savedPlayer = playerService.newPlayer(gameId, player);
        messagingTemplate.convertAndSend("/topic/players", playerService.getAllPlayers(gameId)); // Envía todos los jugadores
        return savedPlayer;
    }
    
    @PutMapping("/{playerId}")
    public Player updatePlayer(@PathVariable String gameId, @PathVariable String playerId, @RequestBody Player player) {
        player.setGameId(gameId);
        Player updatedPlayer = playerService.updatePlayer(player);
        messagingTemplate.convertAndSend("/topic/players", playerService.getAllPlayers(gameId)); // Envía todos los jugadores
        return updatedPlayer;
    }
}
