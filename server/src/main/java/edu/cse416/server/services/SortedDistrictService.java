package edu.cse416.server.services;

import edu.cse416.server.database.SortedDistrictRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class SortedDistrictService
{
    @Autowired
    private SortedDistrictRepository repository;

    @Cacheable("sortedDistricts")
    public List<SortedDistrict> get(State state, Race race)
    {
        return repository.find(state, race);
    }
}
