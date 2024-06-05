package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "color_bins")
public class ColorBin
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("race")
    private Race race;
    @Field("mode")
    private Mode mode;
    @Field("bin")
    private int bin;
    @Field("min")
    private double min;
    @Field("max")
    private double max;
    @Field("color")
    private String color;

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

    public Mode getMode()
    {
        return mode;
    }

    public void setMode(Mode mode)
    {
        this.mode = mode;
    }

    public int getBin()
    {
        return bin;
    }

    public void setBin(int bin)
    {
        this.bin = bin;
    }

    public double getMin()
    {
        return min;
    }

    public void setMin(double min)
    {
        this.min = min;
    }

    public double getMax()
    {
        return max;
    }

    public void setMax(double max)
    {
        this.max = max;
    }

    public String getColor()
    {
        return color;
    }

    public void setColor(String color)
    {
        this.color = color;
    }
}
