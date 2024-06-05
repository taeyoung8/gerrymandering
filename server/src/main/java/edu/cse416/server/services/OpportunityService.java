package edu.cse416.server.services;

import edu.cse416.server.database.OpportunityRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class OpportunityService
{
    @Autowired
    private OpportunityRepository repository;

    @Cacheable("opportunity")
    public List<Opportunity> get(State state, Race race, int ensemble)
    {
        return repository.find(state, race, ensemble);
    }
}
