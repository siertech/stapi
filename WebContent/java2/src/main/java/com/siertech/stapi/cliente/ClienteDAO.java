package com.siertech.stapi.cliente;
import com.siertech.stapi.model.GenericDAO;
import org.springframework.stereotype.Repository;

@Repository
public class ClienteDAO  extends GenericDAO<Cliente> {
	
	

	public ClienteDAO() {
		
		super(Cliente.class);
		
	}
	
	
	
	
}
