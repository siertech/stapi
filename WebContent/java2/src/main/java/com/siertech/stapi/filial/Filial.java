package com.siertech.stapi.filial;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter @Setter
@Table(name = "filial")
public class Filial  {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private long id;
	
	//quando = 1, a filial está bloqueada, não pode ser acesada
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private int bloqueada;

	//Usado pelo sistema
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String nome;


}
