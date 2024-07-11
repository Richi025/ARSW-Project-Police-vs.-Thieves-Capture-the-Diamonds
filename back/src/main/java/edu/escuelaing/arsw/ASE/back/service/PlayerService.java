package edu.escuelaing.arsw.ASE.back.service;

import edu.escuelaing.arsw.ASE.back.model.Player;
import edu.escuelaing.arsw.ASE.back.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {
    @Autowired
    private PlayerRepository playerRepository;

    public List<Player> getAllPlayers(String gameId) {
        return playerRepository.findByGameId(gameId);
    }

    public Player updatePlayer(Player player) {
        return playerRepository.save(player);
    }

    public Player newPlayer(String gameId, Player player) {
        player.setGameId(gameId); // Establecer el gameId
        return playerRepository.save(player);
    }
}

