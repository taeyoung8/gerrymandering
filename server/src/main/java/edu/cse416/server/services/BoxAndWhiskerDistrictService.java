package edu.cse416.server.services;

import edu.cse416.server.database.BoxAndWhiskerDistrictRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class BoxAndWhiskerDistrictService
{
    @Autowired
    private BoxAndWhiskerDistrictRepository repository;

    @Cacheable("boxes")
    public List<BoxAndWhiskerDistrict> get(State state, Race race)
    {
        return repository.find(state, race);
    }
}
