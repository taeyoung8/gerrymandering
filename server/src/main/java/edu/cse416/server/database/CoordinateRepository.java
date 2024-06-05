package edu.cse416.server.database;

import edu.cse416.server.models.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CoordinateRepository extends MongoRepository<Coordinate, String>
{
    Coordinate findByState(State state);
}
