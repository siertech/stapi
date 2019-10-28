package com.siertech.stapi.database;
import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.siertech.stapi.security.AccountUserDetails;

//Classe responsável pela identificação do tenant current
public class CurrentTenantIdentifierResolverImpl implements CurrentTenantIdentifierResolver {
	  
	  @Override
	  public String resolveCurrentTenantIdentifier() {
	      Authentication authentication = SecurityContextHolder.getContext().getAuthentication();        
	      
	      //Banco de dados padrão do sistema
	      String database = "shared";
	      
	      if(authentication != null &&  authentication.getPrincipal() instanceof AccountUserDetails){
	    	  AccountUserDetails user = (AccountUserDetails)authentication.getPrincipal();
	    	  database = user.getDataBase();
	    	  
	      }
	      
	      return database;
	  }

	  @Override
	  public boolean validateExistingCurrentSessions() {
	      return true;
	  }

	}