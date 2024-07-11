package edu.escuelaing.arsw.ASE.back.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "players")
public class Player {
    @Id
    private String id;

    private String name;
    private int top;
    private int left;
    private String direction;
    private boolean isThief;
    private int score;
    private String gameId; // Asegúrate de tener este campo

    public Player(String name, int top, int left, String direction, boolean isThief, int score, String gameId) {
        this.name = name;
        this.top = top;
        this.left = left;
        this.direction = direction;
        this.isThief = isThief;
        this.score = score;
        this.gameId = gameId;
    }

    // Getters y setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTop() {
        return top;
    }

    public void setTop(int top) {
        this.top = top;
    }

    public int getLeft() {
        return left;
    }

    public void setLeft(int left) {
        this.left = left;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public boolean isThief() {
        return isThief;
    }

    public void setThief(boolean isThief) {
        this.isThief = isThief;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getGameId() {
        return gameId;
    }

    public void setGameId(String gameId) {
        this.gameId = gameId;
    }
}
