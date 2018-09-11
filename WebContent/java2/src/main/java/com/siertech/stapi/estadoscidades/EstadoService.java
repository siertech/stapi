package com.siertech.stapi.estadoscidades;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.siertech.stapi.model.GenericService;

@Service
public class EstadoService extends GenericService<Estado>{
  
	@Autowired
	EstadoDAO estadoDAO;
	
	@Transactional
	public Estado getEstadoByUf(String uf){
		
		return estadoDAO.getEstadoByUf(uf);
		
	}
	
}
