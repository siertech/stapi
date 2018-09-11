package com.siertech.stapi.teste;

import javax.persistence.Column;
import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class TestDefinition extends CrudClass {
	
	@JsonView(Views.Public.class)
	private String titulo;

	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String descricao;
	
	@JsonView(Views.Public.class)
	private String queryVerification;
	
	@JsonView(Views.Public.class)
	private double precoTeste;
	
	@JsonView(Views.Public.class)
	private int nivelDificuldade;
}
