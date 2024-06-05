package edu.cse416.server.controllers;

import edu.cse416.server.models.*;
import edu.cse416.server.services.UIColorsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ui")
public class UIController
{
    @Autowired
    private UIColorsService colorsService;
   
    @GetMapping(value = "/colors", produces = "application/json")
    public ResponseEntity<UIColors> getColors()
    {
        return ResponseEntity.ok(colorsService.get());
    }
}

