package com.siertech.stapi.crud;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.util.DataUtil;

import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter @Setter
public  class CrudClass {
	
	
	@ElementCollection(targetClass=String.class,fetch=FetchType.EAGER)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Map<String,String> _string = new HashMap<String,String>();
	
	@ElementCollection(targetClass=Double.class,fetch=FetchType.EAGER)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Map<String,Double> _double = new HashMap<String,Double>();
	
	@ElementCollection(targetClass=Integer.class,fetch=FetchType.EAGER)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Map<String,Integer> _int = new HashMap<String,Integer>();
	
	@ElementCollection(targetClass=String.class,fetch=FetchType.EAGER)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Map<String,String> _date = new HashMap<String,String>();
	
	
	//Filial correspondente
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@Column(name = "idFilial", columnDefinition = "bigint(20) default 1",nullable=false)
	private long idFilial;
	
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@Column(name = "idOperador", columnDefinition = "bigint(20) default 1",nullable=false)
    private long idOperador;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String orderIndex;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String checked;
	
	//Objeto disponivel para todas as filiais
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@Column(name = "allFilials", columnDefinition = "int(11) default 0")
	private boolean allFilials;
	
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private int disable;

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private long id;
	
	//Armazena o historico de manipulacao do objeto
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@Column( length = 100000 )
	private String historicoObjeto;
	
	
	//Data de pagamento da movimentação
	@Temporal(TemporalType.DATE)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Date dataCadastro;


	public void setDataCadastro(String dataCadastro) {
		
		if(dataCadastro==null){
			this.dataCadastro = new Date();
		}
		else{
		this.dataCadastro = DataUtil.formatData(dataCadastro);
		}
	}

}
