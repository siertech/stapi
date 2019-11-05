package com.siertech.stapi.config;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.CollectionTable;
import javax.persistence.ElementCollection;
import com.fasterxml.jackson.annotation.JsonView;

@Entity
@Table(name = "config")
@Component
public class Config {
	
	public static String NOME_TESTE="Thomaz R. Damasceno";

	public Config(){
		
		this.id=1;
	}
	@Id
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private long id;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
	
	
	@ElementCollection(targetClass=String.class,fetch=FetchType.EAGER)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@CollectionTable(name="config_confs")
	private Map<String,String> confs = new HashMap<String,String>();
	
	public Map<String, String> getConfs() {
		return confs;
	}

	public void setConfs(Map<String, String> confs) {
		this.confs = confs;
	}


}
