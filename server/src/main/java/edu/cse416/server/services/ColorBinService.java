package edu.cse416.server.services;

import edu.cse416.server.database.ColorBinRepository;
import edu.cse416.server.models.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class ColorBinService
{
    @Autowired
    private ColorBinRepository repository;

    @Cacheable("bins")
    public List<ColorBin> get(State state, Mode mode, Race race)
    {
        return repository.find(state, mode, race);
    }
}
