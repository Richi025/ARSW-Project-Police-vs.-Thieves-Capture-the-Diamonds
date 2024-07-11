package edu.escuelaing.arsw.ASE.back.repository;

import edu.escuelaing.arsw.ASE.back.model.Game;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GameRepository extends MongoRepository<Game, String> {
}

