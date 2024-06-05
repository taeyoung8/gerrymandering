package edu.cse416.server.services;

import edu.cse416.server.database.HeatMapFeatureRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class HeatMapFeatureService
{
    @Autowired
    private HeatMapFeatureRepository repository;

    @Cacheable("heatmap")
    public List<HeatMapFeature> getAll(State state, Mode mode)
    {
        return repository.findByState(state, mode);
    }

    @Cacheable("heatmap")
    public HeatMapFeature get(State state, Mode mode, int number)
    {
        return repository.find(state, mode, number);
    }
}
