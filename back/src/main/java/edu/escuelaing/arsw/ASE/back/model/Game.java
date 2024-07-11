package edu.escuelaing.arsw.ASE.back.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.List;

@Document(collection = "games")
public class Game {
    @Id
    private String  id;

    @DBRef
    private List<Player> players;

    private boolean isGameOver;
    private String winner;

    public Game(String  gameId) {
        this.id = gameId;
    }
    
    public String  getId() {
        return id;
    }
    public void setId(String  id) {
        this.id = id;
    }
    public List<Player> getPlayers() {
        return players;
    }
    public void setPlayers(List<Player> players) {
        this.players = players;
    }
    
    public boolean isGameOver() {
        return isGameOver;
    }
    public void setGameOver(boolean isGameOver) {
        this.isGameOver = isGameOver;
    }
    public String getWinner() {
        return winner;
    }
    public void setWinner(String winner) {
        this.winner = winner;
    }

}