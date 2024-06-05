package edu.cse416.server.controllers;

import edu.cse416.server.models.*;
import edu.cse416.server.services.EcologicalInferenceService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compare")
public class CompareController
{
    @Autowired
    private EcologicalInferenceService ecologicalInferenceService;
   
    @GetMapping(value = "/ei", produces = "application/json")
    public ResponseEntity<List<EcologicalInference>> getEcologicalInference(@RequestParam State state, @RequestParam PoliticalParty party)
    {
        return ResponseEntity.ok(ecologicalInferenceService.get(state, party));
    }
}

