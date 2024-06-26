package edu.cse416.server.database;

import edu.cse416.server.models.*;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UIColorsRepository extends MongoRepository<UIColors, String>
{
    UIColors findByNumber(int number);
}
