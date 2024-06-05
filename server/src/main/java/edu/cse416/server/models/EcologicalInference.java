package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "ecological_inference")
public class EcologicalInference
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("race")
    private Race race;
    @Field("party")
    private PoliticalParty party;
    @Field("race_mean")
    private double raceMean;
    @Field("race_low")
    private double raceLowerInterval;
    @Field("race_up")
    private double raceUpperInterval;

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

    public PoliticalParty getParty() 
    {
        return party;
    }

    public void setParty(PoliticalParty party)
    {
        this.party = party;
    }

    public double getRaceMean()
    {
        return raceMean;
    }

    public void setRaceMean(double raceMean)
    {
        this.raceMean = raceMean;
    }

    public double getRaceLowerInterval()
    {
        return raceLowerInterval;
    }

    public void setRaceLowerInterval(double raceLowerInterval)
    {
        this.raceLowerInterval = raceLowerInterval;
    }

    public double getRaceUpperInterval()
    {
        return raceUpperInterval;
    }

    public void setRaceUpperInterval(double raceUpperInterval)
    {
        this.raceUpperInterval = raceUpperInterval;
    }
}
