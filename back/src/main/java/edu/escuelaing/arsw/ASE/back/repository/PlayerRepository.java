package edu.escuelaing.arsw.ASE.back.repository;

import edu.escuelaing.arsw.ASE.back.model.Player;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface PlayerRepository extends MongoRepository<Player, String> {
    List<Player> findByGameId(String gameId);
}
