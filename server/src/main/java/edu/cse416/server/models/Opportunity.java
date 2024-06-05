package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "opportunities")
public class Opportunity
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("race")
    private Race race;
    @Field("ensemble")
    private int ensembleSize;
    @Field("plan")
    private int plan;
    @Field("low_count")
    private int lowCount;
    @Field("medium_count")
    private int mediumCount;
    @Field("high_count")
    private int highCount;

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

    public int getEnsembleSize()
    {
        return ensembleSize;
    }

    public void setEnsembleSize(int ensembleSize)
    {
        this.ensembleSize = ensembleSize;
    }

    public int getPlan()
    {
        return plan;
    }

    public void setPlan(int plan)
    {
        this.plan = plan;
    }

    public int getLowCount()
    {
        return lowCount;
    }

    public void setLowCount(int lowCount)
    {
        this.lowCount = lowCount;
    }

    public int getMediumCount()
    {
        return mediumCount;
    }

    public void setMediumCount(int mediumCount)
    {
        this.mediumCount = mediumCount;
    }

    public int getHighCount()
    {
        return highCount;
    }

    public void setHighCount(int highCount)
    {
        this.highCount = highCount;
    }
}
