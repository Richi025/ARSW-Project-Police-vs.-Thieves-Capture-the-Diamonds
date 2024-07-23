package edu.escuelaing.arsw.ASE.back.controller;

import edu.escuelaing.arsw.ASE.back.model.Player;
import edu.escuelaing.arsw.ASE.back.model.GameMatrix;
import edu.escuelaing.arsw.ASE.back.service.GameService;
import edu.escuelaing.arsw.ASE.back.service.PlayerService;

import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.List;
import java.util.Map;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Timer;
import java.util.TimerTask;

@Component
public class WebSocketController extends TextWebSocketHandler {

    private static final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private static final ConcurrentHashMap<String, Boolean> playerReadyStatus = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, String> playerNames = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, Player> players = new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<Integer, int[]> initialPositions = new ConcurrentHashMap<>();
    private static final int totalPlayers = 2;  // Número total de jugadores necesarios para comenzar el juego
    private static final Gson gson = new Gson();
    private static final GameMatrix gameState = new GameMatrix(); // Única instancia compartida de GameMatrix
    private boolean gameOver = false;
    private String winner = "";

    @Autowired
    private GameService gameService;

    private Timer timer;
    private int timeLeft = 180; // Tiempo en segundos

    @Autowired
    private PlayerService playerService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connection established: " + session.getId());
        synchronized (sessions) {
            sessions.add(session);
        }
        synchronized (playerReadyStatus) {
            playerReadyStatus.put(session.getId(), false); // Asegúrate de que el jugador no esté listo inicialmente
        }
        synchronized (playerNames) {
            playerNames.put(session.getId(), "Unknown"); // Nombre predeterminado
        }

        updatePlayersStatus();
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        if (!session.isOpen() || gameOver) {
            return;
        }

        String payload = message.getPayload();
        //System.out.println("Message received: " + payload);
        Map<String, Object> data = gson.fromJson(payload, Map.class);

        if ("JOIN".equals(data.get("type"))) {
            handleJoinMessage(data, session);
        } else if ("PLAYER_READY".equals(data.get("type"))) {
            System.out.println("Setting player as ready for session: " + session.getId());
            synchronized (playerReadyStatus) {
                playerReadyStatus.put(session.getId(), true);
            }
            updatePlayersStatus();

            if (allPlayersReady()) {
                startGame();
            }
        } else if ("PLAYER_MOVE".equals(data.get("type"))) {
            handlePlayerMoveMessage(data, session);
        } else if ("CAPTURE_THIEF".equals(data.get("type"))) {
            handleCaptureThiefMessage(data, session);
        } else {
            sendGameStateToAllSessions();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed: " + session.getId() + ", Status: " + status);
        synchronized (sessions) {
            sessions.remove(session);
        }
        synchronized (playerReadyStatus) {
            playerReadyStatus.remove(session.getId());
        }
        synchronized (playerNames) {
            playerNames.remove(session.getId());
        }
        synchronized (players) {
            players.remove(session.getId());
        }

        updatePlayersStatus();
    }

    private void updatePlayersStatus() throws Exception {
        List<Map<String, Object>> playersStatus = new ArrayList<>();
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    Player player;
                    synchronized (players) {
                        player = players.get(session.getId());
                    }
                    if (player != null) {
                        Map<String, Object> playerStatus = new HashMap<>();
                        playerStatus.put("id", player.getId());
                        playerStatus.put("name", player.getName());
                        playerStatus.put("top", player.getTop());
                        playerStatus.put("left", player.getLeft());
                        playerStatus.put("isThief", player.isThief());
                        playerStatus.put("direction", player.getDirection());
                        playerStatus.put("paso1", player.getPaso1()); // Incluir nuevo atributo
                        playerStatus.put("score", player.getScore()); // Incluir nuevo atributo
                        playerStatus.put("lives", player.getLives()); // Incluir vidas
                        synchronized (playerReadyStatus) {
                            playerStatus.put("isReady", playerReadyStatus.get(session.getId()));
                        }
                        playersStatus.add(playerStatus);
                    }
                }
            }
        }

        Map<String, Object> message = new HashMap<>();
        message.put("type", "UPDATE_PLAYERS");
        message.put("players", playersStatus);

        String jsonMessage = gson.toJson(message);
        //System.out.println("Sending update to all sessions: " + jsonMessage);
        sendToAllSessions(jsonMessage);
    }

    private boolean allPlayersReady() {
        synchronized (playerReadyStatus) {
            boolean allReady = playerReadyStatus.size() >= totalPlayers &&
                    playerReadyStatus.values().stream().allMatch(Boolean::booleanValue);
            System.out.println("All players ready: " + allReady);
            return allReady;
        }
    }

    private void startGame() throws Exception {
        List<Player> currentPlayers;
        synchronized (players) {
            currentPlayers = new ArrayList<>(players.values());
        }
        gameService.initializePlayers(currentPlayers);
        gameState.placePlayers(currentPlayers);  // Colocar los jugadores en la matriz de juego

        for (Player player : currentPlayers) {
            initialPositions.put(player.getId(), new int[]{player.getTop(), player.getLeft()});
        }

        startTimer();

        String initialMatrixJson = convertMatrixToJson(gameState);
        //System.out.println("Initial Game Matrix: " + initialMatrixJson); // Print the initial game matrix to the console

        Map<String, Object> message = new HashMap<>();
        message.put("type", "START_GAME");
        message.put("matrix", gameState.getMatrix());
        message.put("players", currentPlayers);
        String jsonMessage = gson.toJson(message);
        //System.out.println("Sending start game message to all sessions: " + jsonMessage);
        sendToAllSessions(jsonMessage);
    }

    private void startTimer() {
        timer = new Timer();
        timer.scheduleAtFixedRate(new TimerTask() {
            @Override
            public void run() {
                if (gameOver) {
                    timer.cancel();
                } else {
                    updateTime();
                }
            }
        }, 1000, 1000);
    }

    private void updateTime() {
        synchronized (sessions) {
            if (gameOver) {
                return;
            }

            boolean allDiamondsCaptured = true;
            for (int[] row : gameState.getMatrix()) {
                for (int cell : row) {
                    if (cell == 9) {
                        allDiamondsCaptured = false;
                        break;
                    }
                }
                if (!allDiamondsCaptured) {
                    break;
                }
            }

            if (allDiamondsCaptured) {
                gameOver = true;
                winner = "Thieves";
                sendGameOverMessage();
                return;
            }

            int totalThiefLives = 0;
            int totalPoliceScore = 0;
            int totalThiefScore = 0;

            for (Player player : players.values()) {
                if (player.isThief()) {
                    totalThiefLives += player.getLives();
                    totalThiefScore += player.getScore();
                } else {
                    totalPoliceScore += player.getScore();
                }
            }

            if (totalThiefLives == 0) {
                gameOver = true;
                winner = "Police";
                sendGameOverMessage();
                return;
            }

            if (--timeLeft <= 0) {
                gameOver = true;
                if (totalPoliceScore > totalThiefScore) {
                    winner = "Police";
                } else if (totalThiefScore > totalPoliceScore) {
                    winner = "Thieves";
                } else {
                    winner = "Draw";
                }
                sendGameOverMessage();
            } else {
                sendTimerUpdate();
            }
        }
    }

    private void sendTimerUpdate() {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "TIMER_UPDATE");
        message.put("timeLeft", timeLeft);
        String jsonMessage = gson.toJson(message);
        sendToAllSessions(jsonMessage);
    }

    private void sendGameOverMessage() {
        timer.cancel();
        updatePlayerScores();
        Map<String, Object> message = new HashMap<>();
        message.put("type", "GAME_OVER");
        message.put("winner", winner);
        String jsonMessage = gson.toJson(message);
        sendToAllSessions(jsonMessage);
    }

    private void updatePlayerScores() {
        for (Player player : players.values()) {
            playerService.updateScore(player.getMongoId(), player.getScore());
        }
    }

    private void handleJoinMessage(Map<String, Object> data, WebSocketSession session) {
        int playerId = ((Double) data.get("id")).intValue();
        String playerName = (String) data.get("name");
        int top = ((Double) data.get("top")).intValue();
        int left = ((Double) data.get("left")).intValue();
        boolean isThief = (Boolean) data.get("isThief");
        System.out.println(isThief);
        Player player = new Player(playerId, playerName, top, left, isThief);
        playerService.save(player);


        synchronized (players) {
            // Ensure the player ID is unique
            players.values().removeIf(p -> p.getId() == playerId);
            players.put(session.getId(), player);
        }
        synchronized (playerNames) {
            playerNames.put(session.getId(), playerName); // Actualizar nombre del jugador
        }

        System.out.println("Player joined: " + player);

        try {
            sendPlayerListUpdate();
        } catch (Exception e) {
            System.out.println("Error in handleJoinMessage");
            e.printStackTrace();
        }
    }

    private void handlePlayerMoveMessage(Map<String, Object> data, WebSocketSession session) throws Exception {
        int playerId = ((Double) data.get("id")).intValue();
        int previousTop = ((Double) data.get("previousTop")).intValue();
        int previousLeft = ((Double) data.get("previousLeft")).intValue();
        int top = ((Double) data.get("top")).intValue();
        int left = ((Double) data.get("left")).intValue();
        String direction = (String) data.get("direction");
        boolean paso1 = (Boolean) data.get("paso1"); // Recibir nuevo atributo

        // Verificar que los datos recibidos son correctos
        System.out.println("Recibiendo movimiento del jugador:" + ", "  + playerId + ", "  + top + ", "  + left + ", " + direction);
    
        synchronized (players) {
            Player player = players.get(session.getId());
            System.out.println(session.getId());
            System.out.println(player);

            if (player != null) {
                player.setTop(top);
                player.setLeft(left);
                player.setDirection(direction);
                player.setPaso1(paso1); // Actualizar nuevo atributo

                if (player.isThief() && player.getLives() == 0) {
                    return; // Ladrones sin vidas no pueden moverse
                }

                if (gameState.getMatrix()[top][left] == 9  && player.isThief() ) { // Si el jugador recoge un diamante
                    player.setScore(player.getScore() + 100);
                    gameState.setPosition(top, left, 0); // Eliminar el diamante de la matriz
                }

                gameService.updatePlayerPosition(player);
            }
        }
    
        synchronized (gameState) {
            // Limpiar la posición anterior en la matriz
            gameState.setPosition(previousTop, previousLeft, 0); 
            // Actualizar la nueva posición en la matriz
            gameState.setPosition(top, left, playerId); 
        }
    
        sendGameStateToAllSessions();
    }
    
    private void handleCaptureThiefMessage(Map<String, Object> data, WebSocketSession session) throws Exception {
        int policeId = ((Double) data.get("policeId")).intValue();
        int thiefId = ((Double) data.get("thiefId")).intValue();
    
        System.out.println("Captura del ladrón " + thiefId + " por el policía " + policeId);
    
        synchronized (players) {
            Player police = null;
            Player thief = null;
    
            for (Player p : players.values()) {
                if (p.getId() == thiefId) {
                    thief = p;
                }
                if (p.getId() == policeId) {
                    police = p;
                }
                if (thief != null && police != null) {
                    break;
                }
            }
    
            if (thief != null) {
                thief.setLives(thief.getLives() - 1);
                int[] initialPosition = initialPositions.get(thiefId);
                if (initialPosition != null) {
                    int previousTop = thief.getTop();
                    int previousLeft = thief.getLeft();
    
                    thief.setTop(initialPosition[0]);
                    thief.setLeft(initialPosition[1]);
    
                    // Actualizar la posición en la matriz
                    synchronized (gameState) {
                        gameState.setPosition(previousTop, previousLeft, 0); // Limpiar la posición anterior
                        gameState.setPosition(initialPosition[0], initialPosition[1], thiefId); // Establecer nueva posición
                    }
    
                    gameService.updatePlayerPosition(thief);
                    sendInitialPositions(thief);
                }
    
                // Sumar 100 puntos al policía que captura
                if (police != null) {
                    police.setScore(police.getScore() + 100);
                    gameService.updatePlayerPosition(police);
                }
            }
        }
    
        sendGameStateToAllSessions();
    }

    private void sendInitialPositions(Player thief) {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "INITIAL_POSITION");
        message.put("id", thief.getId());
        message.put("top", thief.getTop());
        message.put("left", thief.getLeft());
        String jsonMessage = gson.toJson(message);

        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(jsonMessage));
                } catch (IOException e) {
                    System.err.println("Error sending initial position to session: " + session.getId());
                    e.printStackTrace();
                }
            }
        }
    }

    private String convertMatrixToJson(GameMatrix matrix) {
        return gson.toJson(matrix);
    }

    private synchronized void sendToAllSessions(String message) {
        List<WebSocketSession> closedSessions = new ArrayList<>();
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (IOException | IllegalStateException e) {
                        closedSessions.add(session);
                        System.err.println("Error sending message to session: " + session.getId());
                        e.printStackTrace();
                    }
                } else {
                    closedSessions.add(session);
                }
            }
            // Remove closed sessions from the list
            sessions.removeAll(closedSessions);
        }
    }

    private void sendPlayerListUpdate() throws Exception {
        List<Map<String, Object>> playersStatus = new ArrayList<>();
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    Player player;
                    synchronized (players) {
                        player = players.get(session.getId());
                        //System.out.println(player);
                    }
                    if (player != null) {
                        Map<String, Object> playerStatus = new HashMap<>();
                        playerStatus.put("id", player.getId());
                        playerStatus.put("name", player.getName());
                        playerStatus.put("top", player.getTop());
                        playerStatus.put("left", player.getLeft());
                        playerStatus.put("isThief", player.isThief());
                        playerStatus.put("direction", player.getDirection());

                        //System.out.println("Enviando movimiento del jugador:" + ", " + player.getDirection());

                        synchronized (playerReadyStatus) {
                            playerStatus.put("isReady", playerReadyStatus.get(session.getId()));
                        }
                        playersStatus.add(playerStatus);
                    }
                }
            }
        }

        System.out.println("Current players: " + playersStatus);

        Map<String, Object> message = new HashMap<>();
        message.put("type", "UPDATE_PLAYERS");
        message.put("players", playersStatus);

        String jsonMessage = gson.toJson(message);

        sendToAllSessions(jsonMessage);
    }

    private void sendGameStateToAllSessions() throws Exception {
        Map<String, Object> message = new HashMap<>();
        message.put("type", "UPDATE_GAME_STATE");
        message.put("matrix", gameState.getMatrix());
        message.put("players", new ArrayList<>(players.values())); // Asegurarse de que siempre se envíen los jugadores
        String jsonMessage = gson.toJson(message);
    
        //System.out.println("Enviando estado del juego a todas las sesiones:" + jsonMessage);
    
        sendToAllSessions(jsonMessage);
    }
}

