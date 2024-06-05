package edu.cse416.server.models;

import java.net.URI;

public class Representative
{
    private State state;
    private int district;
    private String name;
    private Race race;
    private PoliticalParty party;
    private URI imageUrl;
    private double voteMargin;

    public Representative(State state, int district, String name, Race race, PoliticalParty party, URI imageUrl, double voteMargin)
    {
        this.state = state;
        this.district = district;
        this.name = name;
        this.race = race;
        this.party = party;
        this.imageUrl = imageUrl;
        this.voteMargin = voteMargin;
    }

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

    public String getName()
    {
        return name;
    }

    public void setName(String name)
    {
        this.name = name;
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

    public URI getImageUrl()
    {
        return imageUrl;
    }

    public void setImageUrl(URI imageUrl)
    {
        this.imageUrl = imageUrl;
    }

    public double getVoteMargin()
    {
        return voteMargin;
    }

    public void setVoteMargin(double voteMargin)
    {
        this.voteMargin = voteMargin;
    }
}
