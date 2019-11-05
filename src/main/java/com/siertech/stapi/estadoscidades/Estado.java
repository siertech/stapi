package com.siertech.stapi.estadoscidades;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonView;

@Entity
@Table(name = "estado")
public class Estado {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private long id;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String codigoUf;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String nome;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String uf;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String regiao;
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getCodigoUf() {
		return codigoUf;
	}

	public void setCodigoUf(String codigoUf) {
		this.codigoUf = codigoUf;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public String getRegiao() {
		return regiao;
	}

	public void setRegiao(String regiao) {
		this.regiao = regiao;
	}

	
	
	
}
