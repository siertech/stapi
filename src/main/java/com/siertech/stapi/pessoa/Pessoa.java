package com.siertech.stapi.pessoa;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorColumn;
import javax.persistence.DiscriminatorType;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.util.Views;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="pessoa")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="tipo_pessoa", discriminatorType=DiscriminatorType.STRING)
@Getter @Setter
public class Pessoa extends CrudClass{


	public static final String TIPO_PESSOA_FISCAL_FISICA="1";
	public static final String TIPO_PESSOA_FISCAL_JURIDICA="2";
	public static final String TIPO_PESSOA_FISCAL_ESTRANGEIRA="3";

	@JsonView(Views.Public.class)
	private String observacoes;
	
	
	@JsonView(Views.Public.class)
	private String filiaisPermitidas;

	@JsonView(Views.Public.class)
	private String permissoes;

	@JsonView(Views.Public.class)
	@Column(unique=true)
	private String pin;

	@JsonView(Views.Public.class)
	@Column(unique=true)
	private String login;

	@JsonView(Views.Public.class)
	private String senha;
	
	@JsonView(Views.Public.class)
	private String nome;

	//Identifica se a senha padrão não foi alterada (defaultPassword==1)
	@JsonView(Views.Public.class)
	private boolean defaultPassword;


	
	@JsonView(Views.Public.class)
	private String email;

	//cliente, fornecedor, funcionario, etc
	@JsonView(Views.Public.class)
	@Column(insertable = false, updatable = false)
	private String tipo_pessoa;

	

	






}
