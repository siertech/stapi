package com.siertech.stapi.projecao;

import java.util.ArrayList;
import java.util.HashMap;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ReorderObject {
	
	@JsonView(Views.Public.class)
	private String objectName;
	
	@JsonView(Views.Public.class)
	private ArrayList<HashMap<String, String>> items;
	
	
	
}
