package artigo;
import com.siertech.stapi.model.GenericDAO;
import org.springframework.stereotype.Repository;

@Repository
public class ArtigoDAO  extends GenericDAO<Artigo> {
	
	

	public ArtigoDAO() {
		
		super(Artigo.class);
		
	}
	
	
	
	
}
