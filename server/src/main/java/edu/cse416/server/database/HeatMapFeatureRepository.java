package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface HeatMapFeatureRepository extends MongoRepository<HeatMapFeature, String>
{
    @Query("{state:'?0', mode:'?1', number:?2}")
    HeatMapFeature find(State state, Mode mode, int number);

    @Query("{state:'?0', mode:'?1'}")
    List<HeatMapFeature> findByState(State state, Mode mode);
}
