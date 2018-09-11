package request;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.util.Views;

@Entity
@Table(name = "request")
@Getter @Setter
public  class Request extends CrudClass {
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String tipo;

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String descricao;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String baseUrl;
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	private String url;
	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String parametros;
	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String body;
	

}
