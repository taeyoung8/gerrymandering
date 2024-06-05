package edu.cse416.server.services;

import edu.cse416.server.database.EcologicalInferenceRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class EcologicalInferenceService
{
    @Autowired
    EcologicalInferenceRepository repository;

    @Cacheable("ei")
    public List<EcologicalInference> get(State state, PoliticalParty party)
    {
        return repository.find(state, party);
    }
}
