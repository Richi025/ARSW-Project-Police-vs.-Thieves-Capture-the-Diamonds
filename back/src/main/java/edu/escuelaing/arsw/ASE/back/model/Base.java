package edu.escuelaing.arsw.ASE.back.model;

public class Base {
    private int top;
    private int left;

    public Base(int top, int left) {
        this.top = top;
        this.left = left;
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
}
