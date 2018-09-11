package com.siertech.stapi.system;
import com.siertech.stapi.config.Config;
import com.siertech.stapi.config.ConfigService;
import com.siertech.stapi.util.SpringUtil;

public class SystemConfig {
	
	public static Config config;
	
	public  static Config getConfig(){
		
		if(config==null){
			
			
			config = ((ConfigService) SpringUtil.getBean("configService")).getById(1);
			
		}
		else{
			System.out.println("------Configura��o j� lida-----");
		}
		
	
		return config;
		
	}
}
