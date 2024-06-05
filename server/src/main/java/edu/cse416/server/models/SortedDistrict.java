package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "sorted_districts")
public class SortedDistrict
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("race")
    private Race race;
    @Field("district_sorted")
    private int districtSorted;
    @Field("pop_percent")
    private double popPercent;

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }

    public Race getRace()
    {
        return race;
    }

    public void setRace(Race race)
    {
        this.race = race;
    }

    public int getDistrictSorted()
    {
        return districtSorted;
    }

    public void setDistrictSorted(int districtSorted)
    {
        this.districtSorted = districtSorted;
    }

    public double getPopPercent()
    {
        return popPercent;
    }

    public void setPopPercent(double popPercent)
    {
        this.popPercent = popPercent;
    }
}
