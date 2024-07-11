package edu.escuelaing.arsw.ASE.back.model;

import java.util.List;

public class GameMatrix {
    private int[][] matrix;
    private int rows;
    private int cols;

    public GameMatrix(int rows, int cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = new int[rows][cols];
        initializeMatrix();
        placeStaticDiamonds();
        placeStaticObstacles();
        placeStaticBases();
    }

    public int[][] getMatrix() {
        return matrix;
    }

    public void setPosition(int row, int col, int value) {
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            matrix[row][col] = value;
        }
    }

    private void initializeMatrix() {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                matrix[i][j] = 0; // Initialize all cells as empty
            }
        }
    }

    private void placeStaticDiamonds() {
        int[][] diamonds = {
            {165, 215}, {165, 365}, {115, 290}, {315, 415}, {15, 650},
            {20, 460}, {70, 515}, {315, 515}, {375, 515}, {465, 515},
            {565, 515}, {265, 315}, {265, 415}, {265, 165}, {265, 50},
            {465, 315}, {560, 315}, {365, 315}, {560, 100}, {15, 700},
            {15, 730}, {15, 760}, {35, 745}, {35, 715}, {55, 730},
            {265, 765}, {165, 690}
        };

        for (int[] diamond : diamonds) {
            int x = diamond[1];
            int y = diamond[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 3; // 3 para diamantes
            }
        }
    }

    private void placeStaticObstacles() {
        int[][] obstacles = {
            {150, 150}, {350, 350}, {450, 550}, {100, 150}, {50, 150},
            {200, 150}, {100, 150}, {100, 100}, {300, 150}, {300, 200},
            {300, 250}, {300, 300}, {300, 350}, {200, 200}, {200, 250},
            {200, 300}, {200, 350}, {50, 450}, {100, 450}, {150, 450},
            {200, 450}, {250, 450}, {300, 450}, {350, 450}, {400, 450},
            {450, 450}, {500, 450}, {450, 350}, {500, 350}, {550, 350},
            {300, 100}, {350, 100}, {400, 200}, {450, 200}, {500, 200},
            {0, 550}, {50, 550}, {100, 550}, {150, 550}, {500, 550},
            {550, 550}, {150, 550}, {150, 550}, {300, 550}, {300, 600},
            {300, 650}, {300, 700}, {300, 750}, {300, 700}
        };

        for (int[] obstacle : obstacles) {
            int x = obstacle[1];
            int y = obstacle[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 4; // 4 para obstáculos
            }
        }
    }

    private void placeStaticBases() {
        int[][] basesThief = {
            {0, 0}
        };

        for (int[] base : basesThief) {
            int x = base[1];
            int y = base[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 5; // 5 para bases de ladrones
            }
        }

        int[][] basesPolice = {
            {400, 700}
        };

        for (int[] base : basesPolice) {
            int x = base[1];
            int y = base[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 6; // 6 para bases de policías
            }
        }
    }

    public void placePlayers(List<Player> players) {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] == 1 || matrix[i][j] == 2) {
                    matrix[i][j] = 0;
                }
            }
        }

        for (Player player : players) {
            int x = player.getLeft();
            int y = player.getTop();
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = player.isThief() ? 2 : 1; // 1 para policías, 2 para ladrones
            }
        }
    }

    public void setMatrix(int[][] matrix2) {
        this.matrix = matrix2;
    }
}
