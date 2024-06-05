package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface SplitRepository extends MongoRepository<Split, String>
{
    @Query("{state: '?0', ensemble: ?1}")
    List<Split> find(State state, int ensemble);
}
