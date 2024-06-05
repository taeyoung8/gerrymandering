package edu.cse416.server.services;

import edu.cse416.server.database.DistrictRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class DistrictService
{
    @Autowired
    DistrictRepository repository;

    @Cacheable("districts")
    public List<District> getAll(State state)
    {
        return repository.findByState(state);
    }

    @Cacheable("districts")
    public District get(State state, int district)
    {
        return repository.find(state, district);
    }

    @Cacheable("districts")
    public District getByRep(String representativeName)
    {
        return repository.findByRepName(representativeName);
    }
}
