package edu.escuelaing.arsw.ASE.back.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.escuelaing.arsw.ASE.back.model.Player;
import edu.escuelaing.arsw.ASE.back.repository.PlayerRepository;

@Service
public class PlayerService {
       
    @Autowired
    private PlayerRepository playerRepository;

    public List<Player> findTop5ByScore() {
        return playerRepository.findByScore();
    }

    public void save(Player player) {
        playerRepository.save(player);
    }

    public void updateScore(int mongoId, int score) {
        Player player = playerRepository.findById(mongoId);
        System.out.println("el player es :" + player);
        if (player != null) {
            player.setScore(score);
            playerRepository.save(player);
        }
    }

}
