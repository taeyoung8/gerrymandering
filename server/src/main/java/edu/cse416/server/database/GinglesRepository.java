package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface GinglesRepository extends MongoRepository<Gingles, String>
{
    @Query("{state: '?0', race: '?1'}")
    List<Gingles> find(State state, Race race);
}
