package com.siertech.stapi.database;
import javax.sql.DataSource;
import org.hibernate.service.jdbc.connections.spi.AbstractDataSourceBasedMultiTenantConnectionProviderImpl;
import com.mchange.v2.c3p0.ComboPooledDataSource;


//Classe para recuperação do Tentant correto
public class MultiTenantConnectionProvider extends AbstractDataSourceBasedMultiTenantConnectionProviderImpl  {

  private static final long serialVersionUID = 6241633589847209550L;
  
  private ComboPooledDataSource defaultDataSource;

  public MultiTenantConnectionProvider(){
	  
	  //Define o banco de dados padrão (shared)
      defaultDataSource = (ComboPooledDataSource) new DataBaseUtil().getDataSource(DataBaseUtil.DB_PREFIX+"shared");
     
  }

  @Override
  protected DataSource selectAnyDataSource(){       
      return defaultDataSource;
  }

  //Seleciona o banco de dados de acordo com seu identificador
  @Override
  protected DataSource selectDataSource(String tenantIdentifier) {
	  
	if(!tenantIdentifier.contains(DataBaseUtil.DB_PREFIX)) 
		tenantIdentifier = DataBaseUtil.DB_PREFIX+tenantIdentifier;
	  
	 return  new DataBaseUtil().getDataSource(tenantIdentifier);
     

  }

}
