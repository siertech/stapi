package com.siertech.stapi.projecao;
import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CustomReport {
	
	@JsonView(Views.Public.class)
	private String qs;
	
	@JsonView(Views.Public.class)
	private String periodColumn;
	
	@JsonView(Views.Public.class)
	private String labelColumn;
	
	@JsonView(Views.Public.class)
	private String valueColumn;
	
	@JsonView(Views.Public.class)
	private String objeto;
	

	
}
