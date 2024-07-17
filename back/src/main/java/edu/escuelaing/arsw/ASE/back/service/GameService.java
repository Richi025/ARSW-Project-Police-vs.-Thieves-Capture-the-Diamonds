package edu.escuelaing.arsw.ASE.back.service;

import edu.escuelaing.arsw.ASE.back.model.GameMatrix;
import edu.escuelaing.arsw.ASE.back.model.Player;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class GameService {
    private GameMatrix gameMatrix = new GameMatrix();
    private List<Player> players = new ArrayList<>();

    public GameMatrix getInitialMatrix() {
        return gameMatrix;
    }

    public GameMatrix initializePlayers(List<Player> initialPlayers) {
        this.players = initialPlayers;
        gameMatrix.placePlayers(players);
        return gameMatrix;
    }

    public GameMatrix updatePlayerPosition(Player playerMove) {
        Player player = players.stream().filter(p -> p.getId() == playerMove.getId()).findFirst().orElse(null);
        if (player != null) {
            player.setLeft(playerMove.getLeft());
            player.setTop(playerMove.getTop());
            player.setDirection(playerMove.getDirection());
            gameMatrix.placePlayers(players);
        }
        return gameMatrix;
    }
}
