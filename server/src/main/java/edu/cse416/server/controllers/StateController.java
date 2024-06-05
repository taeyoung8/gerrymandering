package edu.cse416.server.controllers;

import edu.cse416.server.models.*;
import edu.cse416.server.services.*;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/state")
public class StateController
{
    @Autowired
    private ColorBinService binService;
    @Autowired
    private BoxAndWhiskerDistrictService boxAndWhiskerService;
    @Autowired
    private CoordinateService coordinateService;
    @Autowired
    private DistrictService districtService;
    @Autowired
    private GinglesService ginglesService;
    @Autowired
    private HeatMapFeatureService heatMapFeatureService;
    @Autowired
    private OpportunityService opportunityService;
    @Autowired
    private PrecinctService precinctService;
    @Autowired
    private SortedDistrictService sortedDistrictService;
    @Autowired
    private SplitService splitService;
    @Autowired
    private StateEthnicityService stateEthnicityService;

    @GetMapping(value = "/box", produces = "application/json")
    public ResponseEntity<List<BoxAndWhiskerDistrict>> getBoxAndWhisker(@RequestParam State state, @RequestParam Race race)
    {
        return ResponseEntity.ok(boxAndWhiskerService.get(state, race));
    }

    @GetMapping(value = "/coords", produces = "application/json")
    public ResponseEntity<Coordinate> getCenterCoords(@RequestParam State state)
    {
        return ResponseEntity.ok(coordinateService.get(state));
    }

    @GetMapping(value = "/dinfo", produces = "application/json")
    public ResponseEntity<District> getDistrictInfo(@RequestParam State state, @RequestParam int district)
    {
        District obj = districtService.get(state, district);
        if(obj == null)
        {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(obj);
    }

    @GetMapping(value = "/dsorted", produces = "application/json")
    public ResponseEntity<List<SortedDistrict>> getDistrictSorted(@RequestParam State state, @RequestParam Race race)
    {
        return ResponseEntity.ok(sortedDistrictService.get(state, race));
    }

    @GetMapping(value = "/ethnicity", produces = "application/json")
    public ResponseEntity<StateEthnicity> getStateEthnicity(@RequestParam State state)
    {
        return ResponseEntity.ok(stateEthnicityService.getForState(state));
    }

    @GetMapping(value = "/gingles", produces = "application/json")
    public ResponseEntity<List<Gingles>> getGingles(@RequestParam State state, @RequestParam Race race)
    {
        return ResponseEntity.ok(ginglesService.get(state, race));
    }

    @GetMapping(value = "/hlegend", produces = "application/json")
    public ResponseEntity<List<ColorBin>> getHeatMapLegend(@RequestParam State state, @RequestParam Mode mode, @RequestParam Race race)
    {
        return ResponseEntity.ok(binService.get(state, mode, race));
    }

    @GetMapping(value = "/hmap", produces = "application/json")
    public ResponseEntity<List<HeatMapFeature>> getHeatMap(@RequestParam State state, @RequestParam Mode mode)
    {
        return ResponseEntity.ok(heatMapFeatureService.getAll(state, mode));
    }

    @GetMapping(value = "/opportunity", produces = "application/json")
    public ResponseEntity<List<Opportunity>> getOpportunity(@RequestParam State state, @RequestParam Race race, @RequestParam int ensemble)
    {
        return ResponseEntity.ok(opportunityService.get(state, race, ensemble));
    }

    @GetMapping(value = "/plan", produces = "application/json")
    public ResponseEntity<List<String>> getPlan(@RequestParam State state)
    {
        List<String> districtPlans = new ArrayList<>();
        for(District district : districtService.getAll(state))
        {
            districtPlans.add(district.getGeometry());
        }
        return ResponseEntity.ok(districtPlans);
    }

    @GetMapping(value = "/precincts", produces = "application/json")
    public ResponseEntity<List<Precinct>> getPrecincts(@RequestParam State state)
    {
        return ResponseEntity.ok(precinctService.getAll(state));
    }

    @GetMapping(value = "/splits", produces = "application/json")
    public ResponseEntity<List<Split>> getSplits(@RequestParam State state, @RequestParam int ensemble)
    {
        return ResponseEntity.ok(splitService.get(state, ensemble));
    }

    @GetMapping(value = "/reps", produces = "application/json")
    public ResponseEntity<List<Representative>> getAllRepresentatives(@RequestParam State state)
    {
        List<Representative> representatives = new ArrayList<>();
        for(District district : districtService.getAll(state))
        {
            representatives.add(district.getRepresentative());
        }
        return ResponseEntity.ok(representatives);
    }
}
