package democomponent;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.util.Views;

@Entity
@Table(name = "democomponent")
@Getter @Setter
public  class DemoComponent extends CrudClass {

	
	@JsonView(Views.Public.class)
	@Column( length = 100000 )
	private String content;

}
