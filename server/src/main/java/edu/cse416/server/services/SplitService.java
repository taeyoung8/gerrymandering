package edu.cse416.server.services;

import edu.cse416.server.database.SplitRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class SplitService
{
    @Autowired
    private SplitRepository repository;

    @Cacheable("split")
    public List<Split> get(State state, int ensemble)
    {
        return repository.find(state, ensemble);
    }
}
