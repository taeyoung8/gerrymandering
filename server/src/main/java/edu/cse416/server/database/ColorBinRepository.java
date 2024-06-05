package edu.cse416.server.database;

import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface ColorBinRepository extends MongoRepository<ColorBin, String>
{
    @Query("{state: '?0', mode: '?1', race: '?2'}")
    List<ColorBin> find(State state, Mode mode, Race race);
}
