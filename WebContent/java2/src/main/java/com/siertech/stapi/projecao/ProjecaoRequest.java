package com.siertech.stapi.projecao;


import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Setter @Getter
public class ProjecaoRequest {
    
	@JsonView(Views.Public.class)
    private String objeto;
	
	@JsonView(Views.Public.class)
    private ArrayList<String> qs; 
	
	@JsonView(Views.Public.class)
    private String extra;
	
	@JsonView(Views.Public.class)
    private String columns;
	
	@JsonView(Views.Public.class)
    private String groupBy;
	
	@JsonView(Views.Public.class)
    private int max;
	
	
	
}
