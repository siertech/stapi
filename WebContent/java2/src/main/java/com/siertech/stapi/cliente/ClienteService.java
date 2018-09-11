package com.siertech.stapi.cliente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.siertech.stapi.model.GenericService;

@Service
public class ClienteService extends GenericService<Cliente>   {

    @Autowired
	private ClienteDAO clienteDAO;
	
	
}
