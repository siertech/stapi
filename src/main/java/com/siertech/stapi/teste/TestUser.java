package com.siertech.stapi.teste;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class TestUser extends CrudClass {


	//Produto presente no pedido
	@ManyToOne
	@JoinColumn(name="id_definition",nullable=false)
	@JsonView(Views.Public.class)
	//Armazena o historico de manipulacao do objeto
	private TestDefinition definition;

	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String comentario;

	@JsonView(Views.Public.class)
	private int status;
	
	@JsonView(Views.Public.class)
	@Column(name = "pago", columnDefinition = "int default 0")
	private int pago;
	
	
	@JsonView(Views.Public.class)
	@Column(name = "erroSistema", columnDefinition = "int default 0")
	private int erroSistema;
	
	@JsonView(Views.Public.class)
	private String usuario;
	
	@JsonView(Views.Public.class)
	private Long tempoGasto;
	
	@JsonView(Views.Public.class)
	private double valorPago;
	
	@JsonView(Views.Public.class)
	private int nivelDificuldadeFromUser;
	
}
