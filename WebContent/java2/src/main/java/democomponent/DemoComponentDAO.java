package democomponent;
import org.springframework.beans.factory.annotation.Autowired;
import com.siertech.stapi.model.GenericDAO;
import org.springframework.stereotype.Repository;

@Repository
public class DemoComponentDAO  extends GenericDAO<DemoComponent> {
	
	

	public DemoComponentDAO() {
		
		super(DemoComponent.class);
		
	}
	
	
	
	
}
