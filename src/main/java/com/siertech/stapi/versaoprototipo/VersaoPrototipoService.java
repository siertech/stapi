package com.siertech.stapi.versaoprototipo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.siertech.stapi.model.GenericService;

@Service
public class VersaoPrototipoService extends GenericService<VersaoPrototipo>   {

    @Autowired
	private VersaoPrototipoDAO versaoprototipoDAO;
	
	
}
