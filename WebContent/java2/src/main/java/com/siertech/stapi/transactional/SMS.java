package com.siertech.stapi.transactional;

import com.fasterxml.jackson.annotation.JsonView;


public class SMS {

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String numero;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String mensagem;
	
	public String getNumero() {
		return numero;
	}
	public void setNumero(String numero) {
		this.numero = numero;
	}
	public String getMensagem() {
		return mensagem;
	}
	public void setMensagem(String mensagem) {
		this.mensagem = mensagem;
	}
	
	
	
	public void sendSMS(String numero, String mensagem){
		
		System.out.println("SMS enviado: ");
		System.out.println(mensagem);
		
		SMS sms = new SMS();
		sms.setNumero(numero);
		sms.setMensagem(mensagem);
		SMSCache.cacheSms.add(sms);
	}
	
	
}
