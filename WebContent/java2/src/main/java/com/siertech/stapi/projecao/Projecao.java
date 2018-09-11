package com.siertech.stapi.projecao;

import java.util.ArrayList;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class Projecao {
	
	@JsonView(Views.Public.class)
	private String label;
	
	@JsonView(Views.Public.class)
	private ArrayList<String> series;
	
	@JsonView(Views.Public.class)
	private ArrayList<String> labels;
	
	@JsonView(Views.Public.class)
	private ArrayList<Object> data;
	
	

	
}
