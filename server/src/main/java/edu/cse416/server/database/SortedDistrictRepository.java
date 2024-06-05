package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface SortedDistrictRepository extends MongoRepository<SortedDistrict, String>
{
    @Query("{state: '?0', race: '?1'}")
    List<SortedDistrict> find(State state, Race race);
}
