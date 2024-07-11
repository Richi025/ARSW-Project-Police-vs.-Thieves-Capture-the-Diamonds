package edu.escuelaing.arsw.ASE.back.controller;

import edu.escuelaing.arsw.ASE.back.model.GameState;
import edu.escuelaing.arsw.ASE.back.model.Player;
import edu.escuelaing.arsw.ASE.back.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/games")
public class GameController {

    private static final Logger logger = Logger.getLogger(GameController.class.getName());

    @Autowired
    private GameService gameService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/initialize")
    public ResponseEntity<Void> initializeGame(@RequestParam String gameId, @RequestBody List<Player> players) {
        logger.info("Initializing game with ID: " + gameId);
        gameService.initializeGame(gameId, players);
        messagingTemplate.convertAndSend("/topic/game-state", gameService.getGameState(gameId, players));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/update")
    public ResponseEntity<Void> updatePosition(@RequestParam String gameId, @RequestParam int row, @RequestParam int col, @RequestParam int value) {
        logger.info("Updating position for game ID: " + gameId + ", row: " + row + ", col: " + col + ", value: " + value);
        gameService.updatePosition(gameId, row, col, value);
        messagingTemplate.convertAndSend("/topic/game-state", gameService.getGameState(gameId, null));
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/state")
    public ResponseEntity<GameState> getGameState(@RequestParam String gameId, @RequestBody Map<String, List<Player>> playersMap) {
        logger.info("Getting game state for game ID: " + gameId);
        List<Player> players = playersMap.get("players");
        int[][] matrix = gameService.getGameState(gameId, players);
        GameState gameState = new GameState();
        gameState.setMatrix(matrix);
        logger.info("Returning game state for game ID: " + gameId);
        return ResponseEntity.ok(gameState);
    }
    
    @MessageMapping("/update")
    @SendTo("/topic/game-state")
    public GameState updateGameState(GameState gameState, @Header("simpSessionId") String sessionId) {
        gameService.updateGameState(gameState, "1");
        return gameService.getGameState("1");
    }

}
