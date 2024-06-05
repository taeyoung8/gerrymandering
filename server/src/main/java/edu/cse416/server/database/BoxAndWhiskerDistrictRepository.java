package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface BoxAndWhiskerDistrictRepository extends MongoRepository<BoxAndWhiskerDistrict, String>
{
    @Query("{state: '?0', race: '?1'}")
    List<BoxAndWhiskerDistrict> find(State state, Race race);
}
