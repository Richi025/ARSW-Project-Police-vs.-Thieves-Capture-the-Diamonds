package edu.escuelaing.arsw.ASE.back.repository;

import java.util.List;


import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import edu.escuelaing.arsw.ASE.back.model.Player;

public interface PlayerRepository  extends MongoRepository<Player, Integer>{

    @Query(value = "{}", fields = "{'name': 1, 'score': 1}", sort = "{'score': -1}")
    List<Player> findByScore();

    Player findById(int mongodb);

}
