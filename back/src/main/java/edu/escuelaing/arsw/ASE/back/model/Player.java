package edu.escuelaing.arsw.ASE.back.model;

public class Player {
    private int id;
    private String name;
    private int top;
    private int left;
    private boolean isThief;
    private String direction;

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    private boolean ready = false;

    public boolean isReady() {
        return ready;
    }

    public void setReady(boolean ready) {
        this.ready = ready;
    }

    public Player(int id, String name, int top, int left, boolean isThief) {
        this.id = id;
        this.name = name;
        this.top = top;
        this.left = left;
        this.isThief = isThief;
        this.direction = "down";

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
}
