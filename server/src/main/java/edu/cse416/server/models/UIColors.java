package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "ui_colors")
public class UIColors
{
    @Id
    private String id;
    @Field("number")
    private int number;
    @Field("asian")
    private String asian;
    @Field("black")
    private String black;
    @Field("democratic")
    private String democratic;
    @Field("hispanic")
    private String hispanic;
    @Field("republican")
    private String republican;
    @Field("total")
    private String total;
    @Field("white")
    private String white;

    public int getNumber()
    {
        return number;
    }

    public void setNumber(int number)
    {
        this.number = number;
    }

    public String getAsian()
    {
        return asian;
    }

    public void setAsian(String asian)
    {
        this.asian = asian;
    }

    public String getBlack()
    {
        return black;
    }

    public void setBlack(String black)
    {
        this.black = black;
    }

    public String getDemocratic()
    {
        return democratic;
    }

    public void setDemocratic(String democratic)
    {
        this.democratic = democratic;
    }

    public String getHispanic()
    {
        return hispanic;
    }

    public void setHispanic(String hispanic)
    {
        this.hispanic = hispanic;
    }

    public String getRepublican()
    {
        return republican;
    }

    public void setRepublican(String republican)
    {
        this.republican = republican;
    }

    public String getTotal()
    {
        return total;
    }

    public void setTotal(String total)
    {
        this.total = total;
    }

    public String getWhite()
    {
        return white;
    }

    public void setWhite(String white)
    {
        this.white = white;
    }
}
