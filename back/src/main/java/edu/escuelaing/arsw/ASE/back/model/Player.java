package edu.escuelaing.arsw.ASE.back.model;

import java.util.Random;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("Players")
public class Player {

    @Id
    private int mongoId;


    private int id;

    private String name;
    private int top;
    private int left;
    private boolean isThief;
    private String direction;
    private boolean paso1;
    private int score;
    private int lives; // Nuevo atributo para las vidas
    private boolean ready;

    // Método estático para generar un ID de 8 dígitos
    private static int generate8DigitId() {
        Random random = new Random();
        return 10000000 + random.nextInt(90000000);
    }

    public Player(int id, String name, int top, int left, boolean isThief) {
        this.mongoId = generate8DigitId();
        this.id = id;
        this.name = name;
        this.top = top;
        this.left = left;
        this.isThief = isThief;
        this.direction = "down";
        this.paso1 = true;
        this.score = 0;
        this.lives = isThief ? 3 : 0; // Inicializar las vidas solo si es ladrón
    }

    // Constructor sin parámetros
    public Player() {
        this.mongoId = generate8DigitId();
        this.id = 0;
        this.name = "";
        this.top = 0;
        this.left = 0;
        this.isThief = false;
        this.direction = "down";
        this.paso1 = true;
        this.score = 0;
        this.lives = 0; // Inicializar con 0 vidas
        this.ready = false;
    }

    public int getMongoId() {
        return mongoId;
    }

    public void setMongoId(int mongoId) {
        this.mongoId = mongoId;
    }

    public boolean getPaso1() {
        return paso1;
    }

    public void setPaso1(boolean paso1) {
        this.paso1 = paso1;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public boolean isReady() {
        return ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public int getTop() {
        return top;
    }

    public int getLeft() {
        return left;
    }

    public void setTop(int top) {
        this.top = top;
    }

    public void setLeft(int left) {
        this.left = left;
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

    public int getLives() {
        return lives;
    }

    public void setLives(int lives) {
        this.lives = lives;
    }


}
