package edu.cse416.server.services;

import edu.cse416.server.database.UIColorsRepository;
import edu.cse416.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class UIColorsService
{
    @Autowired
    private UIColorsRepository repository;

    @Cacheable("uiColors")
    public UIColors get()
    {
        return repository.findByNumber(0);
    }
}
