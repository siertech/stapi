package com.siertech.stapi.prototipo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.siertech.stapi.model.GenericService;

@Service
public class PrototipoService extends GenericService<Prototipo>   {

    @Autowired
	private PrototipoDAO prototipoDAO;
	
	
}
