package request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.siertech.stapi.model.GenericService;

@Service
public class RequestService extends GenericService<Request>   {

    @Autowired
	private RequestDAO requestDAO;
	
	
}
