package com.siertech.stapi.operadorsistema;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.pessoa.Pessoa;

@Entity
@DiscriminatorValue("operador_sistema")
public class OperadorSistema extends Pessoa {
	
	
	
	
	

}
