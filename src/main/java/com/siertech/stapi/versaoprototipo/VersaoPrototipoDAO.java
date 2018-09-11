package com.siertech.stapi.versaoprototipo;
import com.siertech.stapi.model.GenericDAO;
import com.siertech.stapi.prototipo.Prototipo;
import com.siertech.stapi.prototipo.PrototipoDAO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class VersaoPrototipoDAO  extends GenericDAO<VersaoPrototipo> {
	
	@Autowired
	private PrototipoDAO prototipoDAO;
	
	@Override
	public VersaoPrototipo addOrUpdate(VersaoPrototipo versaoPrototipo) {
	
		Prototipo prot = versaoPrototipo.getPrototipo();
		prototipoDAO.addOrUpdate(prot);
		versaoPrototipo.setPrototipo(prot);
		return super.addOrUpdate(versaoPrototipo);
	}

	public VersaoPrototipoDAO() {
		
		super(VersaoPrototipo.class);
		
	}
	
	
	
	
}
