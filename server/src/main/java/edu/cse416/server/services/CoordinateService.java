package edu.cse416.server.services;

import edu.cse416.server.database.CoordinateRepository;
import edu.cse416.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class CoordinateService
{
    @Autowired
    private CoordinateRepository repository;

    @Cacheable("coordinates")
    public Coordinate get(State state)
    {
        return repository.findByState(state);
    }
}
