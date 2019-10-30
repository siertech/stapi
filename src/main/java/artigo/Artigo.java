package artigo;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.util.Views;

@Entity
@Table(name = "artigo")
@Getter @Setter
public  class Artigo extends CrudClass {
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String testeParaVerSeEstaAtualizando222;

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String titulo;
	
	@JsonView(Views.Public.class)
	private String tags;
	
	@JsonView(Views.Public.class)
	private String url;
	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String content;
	

}
