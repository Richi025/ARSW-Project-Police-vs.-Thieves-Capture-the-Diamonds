package edu.escuelaing.arsw.ASE.back.service;

import edu.escuelaing.arsw.ASE.back.model.GameMatrix;
import edu.escuelaing.arsw.ASE.back.model.GameState;
import edu.escuelaing.arsw.ASE.back.model.Player;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class GameService {

    private ConcurrentMap<String, GameMatrix> gameMatrices = new ConcurrentHashMap<>();

    public void initializeGame(String gameId, List<Player> players) {
        GameMatrix gameMatrix = new GameMatrix(600, 800); // Adjust dimensions to match game container (800x600, cells are 50x50)
        gameMatrix.placePlayers(players);
        gameMatrices.put(gameId, gameMatrix);
    }

    public void updatePosition(String gameId, int row, int col, int value) {
        GameMatrix gameMatrix = gameMatrices.get(gameId);
        if (gameMatrix != null) {
            gameMatrix.setPosition(row, col, value);
        }
    }

    public int[][] getGameState(String gameId, List<Player> players) {
        GameMatrix gameMatrix = gameMatrices.get(gameId);
        if (gameMatrix == null) {
            System.out.println("Game not found, initializing default game.");
            initializeGame(gameId, players); // Ensure game is initialized if not found
            gameMatrix = gameMatrices.get(gameId);
        }
        if (gameMatrix != null) {
            gameMatrix.placePlayers(players);
            System.out.println("Returning game state for game ID: " + gameId);
            return gameMatrix.getMatrix();
        }
        return new int[600][800]; // Return an empty matrix if something goes wrong
    }

    public GameState getGameState(String gameId) {
        GameMatrix gameMatrix = gameMatrices.get(gameId);
        if (gameMatrix != null) {
            GameState gameState = new GameState();
            gameState.setMatrix(gameMatrix.getMatrix());
            return gameState;
        }
        return new GameState();
    }

    public void updateGameState(GameState gameState, String gameId) {
        GameMatrix gameMatrix = gameMatrices.get(gameId);
        if (gameMatrix != null) {
            gameMatrix.setMatrix(gameState.getMatrix());
        }
    }

    // Método para printear gameMatrices
    public void printGameMatrices() {
        gameMatrices.forEach((gameId, gameMatrix) -> {
            System.out.println("Game ID: " + gameId);
            int[][] matrix = gameMatrix.getMatrix();
            for (int i = 0; i < matrix.length; i++) {
                for (int j = 0; j < matrix[i].length; j++) {
                    System.out.print(matrix[i][j] + " ");
                }
                System.out.println();
            }
        });
    }
}
