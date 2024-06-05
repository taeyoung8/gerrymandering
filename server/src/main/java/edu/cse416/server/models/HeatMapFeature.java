package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "heatmap")
public class HeatMapFeature
{
    @Id
    private String id;
    @Field("number")
    private int number;
    @Field("state")
    private State state;
    @Field("mode")
    private Mode mode;
    @Field("white_color")
    private String whiteColor;
    @Field("black_color")
    private String blackColor;
    @Field("hisp_color")
    private String hispanicColor;
    @Field("asian_color")
    private String asianColor;
    @Field("geometry")
    private String geometry;

    public int getNumber()
    {
        return number;
    }

    public void setNumber(int number)
    {
        this.number = number;
    }

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }

    public Mode getMode()
    {
        return mode;
    }

    public void setMode(Mode mode)
    {
        this.mode = mode;
    }

    public String getWhiteColor()
    {
        return whiteColor;
    }

    public void setWhiteColor(String whiteColor)
    {
        this.whiteColor = whiteColor;
    }

    public String getBlackColor()
    {
        return blackColor;
    }

    public void setBlackColor(String blackColor)
    {
        this.blackColor = blackColor;
    }

    public String getHispanicColor()
    {
        return hispanicColor;
    }

    public void setHispanicColor(String hispanicColor)
    {
        this.hispanicColor = hispanicColor;
    }

    public String getAsianColor()
    {
        return asianColor;
    }

    public void setAsianColor(String asianColor)
    {
        this.asianColor = asianColor;
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
