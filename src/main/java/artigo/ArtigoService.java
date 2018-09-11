package artigo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.siertech.stapi.model.GenericService;

@Service
public class ArtigoService extends GenericService<Artigo>   {

    @Autowired
	private ArtigoDAO artigoDAO;
	
	
}
