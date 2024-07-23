package edu.escuelaing.arsw.ASE.back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.beans.factory.annotation.Autowired;
import edu.escuelaing.arsw.ASE.back.controller.WebSocketController;

/**
 * Configuration class for WebSocket.
 * This class enables WebSocket and registers WebSocket handlers.
 */
@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final WebSocketController webSocketController;


    /**
     * Constructs a new WebSocketConfig with the specified WebSocketController.
     *
     * @param webSocketController the WebSocketController to handle WebSocket connections
     */
    @Autowired
    public WebSocketConfig(WebSocketController webSocketController) {
        this.webSocketController = webSocketController;
    }

    /**
     * Registers WebSocket handlers with the specified WebSocketHandlerRegistry.
     * This method adds the WebSocketController handler to the "/lobby" endpoint
     * and allows all origins.
     *
     * @param registry the WebSocketHandlerRegistry to register handlers with
     */
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketController, "/lobby").setAllowedOrigins("*");
    }
}
