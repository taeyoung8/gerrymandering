package edu.cse416.server.services;

import edu.cse416.server.database.PrecinctRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class PrecinctService
{
    @Autowired
    PrecinctRepository repository;

    @Cacheable("precincts")
    public List<Precinct> getAll(State state)
    {
        return repository.findByState(state);
    }

    @Cacheable("precincts")
    public Precinct get(State state, int precinct)
    {
        return repository.find(state, precinct);
    }
}
