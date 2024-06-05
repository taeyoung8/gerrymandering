package edu.cse416.server.database;

import edu.cse416.server.models.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StateEthnicityRepository extends MongoRepository<StateEthnicity, String>
{
    StateEthnicity findByState(State state);
}
