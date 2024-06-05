package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "gingles")
public class Gingles
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("race")
    private Race race;
    @Field("party")
    private PoliticalParty party;
    @Field("scatter_x")
    private double[] scatterX;
    @Field("scatter_y")
    private double[] scatterY;
    @Field("scatter_pre")
    private int[] scatterPrecinct;
    @Field("scatter_len")
    private int scatterLength;
    @Field("non_linear_a")
    private double nonLinearA;
    @Field("non_linear_b")
    private double nonLinearB;
    @Field("non_linear_c")
    private double nonLinearC;

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

    public double[] getScatterX()
    {
        return scatterX;
    }

    public void setScatterX(double[] scatterX)
    {
        this.scatterX = scatterX;
    }

    public double[] getScatterY()
    {
        return scatterY;
    }

    public void setScatterY(double[] scatterY)
    {
        this.scatterY = scatterY;
    }

    public int[] getScatterPrecinct()
    {
        return scatterPrecinct;
    }

    public void setScatterPrecinct(int[] scatterPrecinct)
    {
        this.scatterPrecinct = scatterPrecinct;
    }

    public int getScatterLength()
    {
        return scatterLength;
    }

    public void setScatterLength(int scatterLength)
    {
        this.scatterLength = scatterLength;
    }

    public double getNonLinearA()
    {
        return nonLinearA;
    }

    public void setNonLinearA(double nonLinearA)
    {
        this.nonLinearA = nonLinearA;
    }

    public double getNonLinearB()
    {
        return nonLinearB;
    }

    public void setNonLinearB(double nonLinearB)
    {
        this.nonLinearB = nonLinearB;
    }

    public double getNonLinearC()
    {
        return nonLinearC;
    }

    public void setNonLinearC(double nonLinearC)
    {
        this.nonLinearC = nonLinearC;
    }
}
