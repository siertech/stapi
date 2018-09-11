package com.siertech.stapi.security;

import java.util.ArrayList;
import java.util.Date;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.config.Config;
import com.siertech.stapi.usersystem.UserSystem;
import com.siertech.stapi.filial.Filial;

@Getter @Setter
public class TokenTransfer
{
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private final String token;

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private UserSystem usuarioSistema;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Config config;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Long idLead;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private Date dataBackEnd;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private ArrayList<Filial> filiais;


	public TokenTransfer(String token,UserSystem usuario, Config config, Long idLead, ArrayList<Filial> filiais)
	{
		this.setUsuarioSistema(usuario);
		this.token = token;
		this.config = config;
		this.dataBackEnd = new Date();
		this.idLead = idLead;
		this.filiais = filiais;
	}
	


}