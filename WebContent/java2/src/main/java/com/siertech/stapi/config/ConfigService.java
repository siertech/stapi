package com.siertech.stapi.config;
import org.springframework.stereotype.Service;

import com.siertech.stapi.config.Config;
import com.siertech.stapi.model.GenericService;

@Service
public class ConfigService extends GenericService<Config>{

	public Config getConf(){
		
		return getById(1);
	}
	
}
