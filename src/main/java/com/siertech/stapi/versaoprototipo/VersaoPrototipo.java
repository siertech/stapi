package com.siertech.stapi.versaoprototipo;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.prototipo.Prototipo;
import com.siertech.stapi.util.Views;

@Entity
@Table(name = "versaoprototipo")
@Getter @Setter
public  class VersaoPrototipo extends CrudClass {

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String label;
	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String codigo;
	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String jsContent;
	
	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String cssContent;
	
	@ManyToOne
	@JoinColumn(name="versaoprototipo_prototipo_id")
    @JsonView(Views.Public.class)
	private  Prototipo prototipo;
	
	

}
