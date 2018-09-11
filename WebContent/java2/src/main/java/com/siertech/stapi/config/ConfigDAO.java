package com.siertech.stapi.config;
import org.springframework.stereotype.Repository;

import com.siertech.stapi.config.Config;
import com.siertech.stapi.model.GenericDAO;

@Repository
public class ConfigDAO extends GenericDAO<Config> {

	public ConfigDAO() {
		super(Config.class);
		// TODO Auto-generated constructor stub
	}
   
}
