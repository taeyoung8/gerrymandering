package edu.cse416.server.services;

import edu.cse416.server.database.StateEthnicityRepository;
import edu.cse416.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class StateEthnicityService
{
    @Autowired
    StateEthnicityRepository repository;

    @Cacheable("ethnicities")
    public StateEthnicity getForState(State state)
    {
        return repository.findByState(state);
    }
}
