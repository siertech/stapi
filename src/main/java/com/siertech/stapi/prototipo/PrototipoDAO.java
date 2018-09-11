package com.siertech.stapi.prototipo;
import com.siertech.stapi.model.GenericDAO;
import org.springframework.stereotype.Repository;

@Repository
public class PrototipoDAO  extends GenericDAO<Prototipo> {
	
	public PrototipoDAO() {
		
		super(Prototipo.class);
		
	}
	
	
}
