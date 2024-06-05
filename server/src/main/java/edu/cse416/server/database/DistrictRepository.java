package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface DistrictRepository extends MongoRepository<District, String>
{
    @Query("{state:'?0', district:?1}")
    District find(State state, int district);

    List<District> findByState(State state);

    District findByRepName(String repName);
}
