package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "box_and_whisker")
public class BoxAndWhiskerDistrict
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("district")
    private int district;
    @Field("race")
    private Race race;
    @Field("min")
    private double min;
    @Field("q1")
    private double q1;
    @Field("med")
    private double med;
    @Field("q3")
    private double q3;
    @Field("max")
    private double max;

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }

    public int getDistrict()
    {
        return district;
    }

    public void setDistrict(int district)
    {
        this.district = district;
    }

    public Race getRace()
    {
        return race;
    }

    public void setRace(Race race)
    {
        this.race = race;
    }

    public double getMin()
    {
        return min;
    }

    public void setMin(double min)
    {
        this.min = min;
    }

    public double getQ1()
    {
        return q1;
    }

    public void setQ1(double q1)
    {
        this.q1 = q1;
    }

    public double getMed()
    {
        return med;
    }

    public void setMed(double med)
    {
        this.med = med;
    }

    public double getQ3()
    {
        return q3;
    }

    public void setQ3(double q3)
    {
        this.q3 = q3;
    }

    public double getMax()
    {
        return max;
    }

    public void setMax(double max)
    {
        this.max = max;
    }
}
