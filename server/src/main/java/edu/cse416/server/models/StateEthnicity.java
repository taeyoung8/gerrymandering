package edu.cse416.server.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "state_ethnicities")
public class StateEthnicity
{
    @Id
    private String id;
    @Field("state")
    private State state;
    @Field("labels")
    private String[] labels;
    @Field("percent_assembly")
    private int[] assembly;
    @Field("percent_overall")
    private int[] overall;

    public State getState()
    {
        return state;
    }

    public void setState(State state)
    {
        this.state = state;
    }

    public String[] getLabels()
    {
        return labels;
    }

    public void setLabels(String[] labels)
    {
        this.labels = labels;
    }

    public int[] getAssembly()
    {
        return assembly;
    }

    public void setAssembly(int[] assembly)
    {
        this.assembly = assembly;
    }

    public int[] getOverall()
    {
        return overall;
    }

    public void setOverall(int[] overall)
    {
        this.overall = overall;
    }
}
