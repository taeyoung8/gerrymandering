package edu.cse416.server.models;

import java.net.URI;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "precincts")
public class Precinct 
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("precinct")
    private int precinct;
    @Field("district")
    private int district;
    @Field("tot_pop")
    private long population;
    @Field("white_pop")
    private long populationWhite;
    @Field("black_pop")
    private long populationBlack;
    @Field("hisp_pop")
    private long populationHispanic;
    @Field("asian_pop")
    private long populationAsian;
    @Field("2020_total")
    private long votes2020;
    @Field("2020_democratic")
    private long votes2020Democratic;
    @Field("2020_republican")
    private long votes2020Republican;
    @Field("2020_winner")
    private PoliticalParty winner2020;
    @Field("neighbors")
    private String[] neighbors;
    @Field("geometry")
    private String geometry;

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }

    public int getPrecinct()
    {
        return precinct;
    }

    public void setPrecinct(int precinct)
    {
        this.precinct = precinct;
    }

    public int getDistrict()
    {
        return district;
    }

    public void setDistrict(int district)
    {
        this.district = district;
    }

    public long getPopulation()
    {
        return population;
    }

    public void setPopulation(long population)
    {
        this.population = population;
    }

    public long getPopulationWhite()
    {
        return populationWhite;
    }

    public void setPopulationWhite(long populationWhite)
    {
        this.populationWhite = populationWhite;
    }

    public long getPopulationBlack()
    {
        return populationBlack;
    }

    public void setPopulationBlack(long populationBlack)
    {
        this.populationBlack = populationBlack;
    }

    public long getPopulationHispanic()
    {
        return populationHispanic;
    }

    public void setPopulationHispanic(long populationHispanic)
    {
        this.populationHispanic = populationHispanic;
    }

     public long getPopulationAsian()
    {
        return populationAsian;
    }

    public void setPopulationAsian(long populationAsian)
    {
        this.populationAsian = populationAsian;
    }

    public long getVotes2020()
    {
        return votes2020;
    }

    public void setVotes2020Total(long votes2020)
    {
        this.votes2020 = votes2020;
    }

    public long getVotes2020Democratic()
    {
        return votes2020Democratic;
    }

    public void setVotes2020Democratic(long votes2020Democratic)
    {
        this.votes2020Democratic = votes2020Democratic;
    }

    public long getVotes2020Republican()
    {
        return votes2020Republican;
    }

    public void setVotes2020Republican(long votes2020Republican)
    {
        this.votes2020Republican = votes2020Republican;
    }

    public PoliticalParty getWinner2020()
    {
        return winner2020;
    }

    public void setWinner2020(PoliticalParty winner2020)
    {
        this.winner2020 = winner2020;
    }

    public String[] getNeighbors()
    {
        return neighbors;
    }

    public void setNeighbors(String[] neighbors)
    {
        this.neighbors = neighbors;
    }

    public String getGeometry()
    {
        return geometry;
    }

    public void setGeometry(String geometry)
    {
        this.geometry = geometry;
    }
}