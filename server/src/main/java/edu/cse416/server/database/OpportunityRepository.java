package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface OpportunityRepository extends MongoRepository<Opportunity, String>
{
    @Query("{state: '?0', race: '?1', ensemble: ?2}")
    List<Opportunity> find(State state, Race race, int ensemble);
}
