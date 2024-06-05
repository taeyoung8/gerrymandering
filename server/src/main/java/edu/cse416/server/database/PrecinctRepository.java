package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface PrecinctRepository extends MongoRepository<Precinct, String>
{
    @Query("{state:'?0', precinct:?1}")
    Precinct find(State state, int precinct);

    List<Precinct> findByState(State state);
}
