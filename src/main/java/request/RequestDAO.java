package request;
import com.siertech.stapi.model.GenericDAO;
import org.springframework.stereotype.Repository;

@Repository
public class RequestDAO  extends GenericDAO<Request> {
	
	

	public RequestDAO() {
		
		super(Request.class);
		
	}
	
	
	
	
}
