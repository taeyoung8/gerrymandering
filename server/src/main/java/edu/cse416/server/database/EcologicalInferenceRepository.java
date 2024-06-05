package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface EcologicalInferenceRepository extends MongoRepository<EcologicalInference, String>
{
    @Query("{state:'?0', party:'?1'}")
    List<EcologicalInference> find(State state, PoliticalParty party);
}
