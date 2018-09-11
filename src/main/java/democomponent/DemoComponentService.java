package democomponent;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.siertech.stapi.model.GenericService;

@Service
public class DemoComponentService extends GenericService<DemoComponent>   {

              @Autowired
	private DemoComponentDAO democomponentDAO;
	
	
}
