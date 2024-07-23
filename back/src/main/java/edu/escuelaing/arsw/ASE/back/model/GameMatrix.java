package edu.escuelaing.arsw.ASE.back.model;

import java.util.List;

public class GameMatrix {
    private int[][] matrix;
    private int rows = 30;
    private int cols = 40; // Ajustado para asegurar que la matriz es cuadrada

    public GameMatrix() {
        if (matrix == null) {
            this.matrix = new int[rows][cols];
            initializeMatrix();
            placeStaticDiamonds();
            placeStaticObstacles();
            placeStaticBases();
        } else {
            System.out.println("Ya existe una matrix creada");
        }
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
                matrix[i][j] = 0; // Inicializar todas las celdas como vacías
            }
        }
    }

    private void placeStaticDiamonds() {
        int[][] diamonds = {
            {8, 10}, {8, 18}, {6, 15}, {15, 20}, {1, 33},
            {1, 23}, {4, 25}, {15, 25}, {18, 25}, {23, 25},
            {28, 25}, {13, 15}, {13, 20}, {13, 8}, {13, 2},
            {23, 15}, {28, 15}, {18, 15}, {28, 5}, {1, 35},
            {1, 36}, {1, 38}, {2, 37}, {2, 35}, {3, 36},
            {13, 38}, {8, 34}
        };

        for (int[] diamond : diamonds) {
            int x = diamond[1];
            int y = diamond[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 9; // 9 para diamantes
                //System.out.println("Placed diamond at: (" + y + ", " + x + ")");
            }
        }
    }

    private void placeStaticObstacles() {
        int[][] obstacles = {
            {7, 7}, {17, 17}, {22, 27}, {5, 7}, {2, 7},
            {10, 7}, {5, 7}, {5, 5}, {15, 7}, {15, 10},
            {15, 12}, {15, 15}, {15, 17}, {10, 10}, {10, 12},
            {10, 15}, {10, 17}, {2, 22}, {5, 22}, {7, 22},
            {10, 22}, {12, 22}, {15, 22}, {17, 22}, {20, 22},
            {22, 22}, {25, 22}, {22, 17}, {25, 17}, {27, 17},
            {15, 5}, {17, 5}, {20, 10}, {22, 10}, {25, 10},
            {0, 27}, {2, 27}, {5, 27}, {7, 27}, {25, 27},
            {27, 27}, {7, 27}, {7, 27}, {15, 27}, {15, 30},
            {15, 32}, {15, 35}, {15, 37}, {15, 35}
        };

        for (int[] obstacle : obstacles) {
            int x = obstacle[1];
            int y = obstacle[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 10; // 10 para obstáculos
                //System.out.println("Placed obstacle at: (" + y + ", " + x + ")");
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
                matrix[y][x] = 11; // 11 para bases de ladrones
                //System.out.println("Placed thief base at: (" + y + ", " + x + ")");
            }
        }

        int[][] basesPolice = {
            {20, 35}
        };

        for (int[] base : basesPolice) {
            int x = base[1];
            int y = base[0];
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                matrix[y][x] = 12; // 12 para bases de policías
                //System.out.println("Placed police base at: (" + y + ", " + x + ")");
            }
        }
    }

    public void placePlayers(List<Player> players) {
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (matrix[i][j] >= 1 && matrix[i][j] <= 8) {
                    matrix[i][j] = 0;
                }
            }
        }

        for (Player player : players) {
            int x = player.getLeft();
            int y = player.getTop();
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
                int playerId = player.getId();
                if (playerId >= 1 && playerId <= 8) {
                    matrix[y][x] = playerId; // ID del jugador (1-8) en la posición
                    //System.out.println("Placed player " + playerId + " at: (" + y + ", " + x + ")");
                }
            }
        }
    }

    public void setMatrix(int[][] matrix2) {
        this.matrix = matrix2;
    }
}
