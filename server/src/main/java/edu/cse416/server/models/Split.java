package edu.cse416.server.models;

import java.util.HashMap;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "splits")
public class Split
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("ensemble")
    private int ensembleSize;
    @Field("plan")
    private int plan;
    @Field("rep_dem_split")
    private String repDemSplitStr;
    private HashMap<String, Integer> repDemSplit;

    public Split()
    {
        repDemSplit = new HashMap<>();
    }

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
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

    public String getRepDemSplitStr()
    {
        return repDemSplitStr;
    }

    public void setRepDemSplitStr(String repDemSplitStr)
    {
        this.repDemSplitStr = repDemSplitStr;
    }

    public HashMap<String, Integer> getRepDemSplit()
    {
        repDemSplit.clear();
        if(repDemSplitStr != null)
        {
            String[] splits = repDemSplitStr.split(",");
            for(String split : splits)
            {
                String[] splitPair = split.split(":");
                if(!repDemSplit.containsKey(splitPair[0]))
                {
                    repDemSplit.put(splitPair[0], 0);
                }
                repDemSplit.put(splitPair[0], repDemSplit.get(splitPair[0]) + Integer.parseInt(splitPair[1]));
            }
        }
        return repDemSplit;
    }
}
