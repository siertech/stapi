package com.siertech.stapi.database;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Properties;
import javax.sql.DataSource;
import org.hibernate.cfg.Configuration;
import org.hibernate.cfg.Environment;
import org.hibernate.tool.hbm2ddl.SchemaUpdate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.orm.hibernate4.LocalSessionFactoryBean;
import com.mchange.v2.c3p0.C3P0Registry;
import com.mchange.v2.c3p0.ComboPooledDataSource;
import com.mchange.v2.c3p0.PooledDataSource;
import com.siertech.stapi.crud.CrudClass;
import com.siertech.stapi.security.AccountUserDetails;
import com.siertech.stapi.system.SystemUtil;
import com.siertech.stapi.usersystem.UserSystem;
import com.siertech.stapi.util.SpringUtil;

public class DataBaseUtil {

	//É setado automaticamento pelo provedor multi-tenant
	private static String dbURL;
	public static String DB_PREFIX = "db_";
	public static    Connection connection = null;

	public static Configuration configuration;

	//Recupera as configurações do hibernate definidas em hibernate.cfg.xml
	public Configuration getHibernateConfiguration() {

		if(configuration == null)
			configuration = new Configuration().configure("hibernate.cfg.xml");

		return configuration;
	}

	@SuppressWarnings("rawtypes")
	public static String[] getCrudQueries(Class classe, String[] qs){

		//Verifica se a classe é um CrudEntity
		if(DataBaseUtil.isCrudEntity(classe))
		{
			ArrayList<String> querys = new ArrayList<String>(Arrays.asList(qs));
			querys.add("(disable=0 or disable is null)");

			String queryFilial = getQueryFilial();
			String queryOperador = getQueryOperador();

			if(queryFilial .length()>0)
				querys.add(queryFilial );

			if(queryOperador!=null && queryOperador .length()>0)
				querys.add(queryOperador );

			qs = querys.toArray(new String[]{});

		}

		return qs;
	}

	@SuppressWarnings("rawtypes")
	public static String getDisableQuery(Class classe){

		String disableQuery = "";

		if(DataBaseUtil.isCrudEntity(classe)){
			disableQuery = "(disable=0 or disable is null)";
		}
		return disableQuery;
	}

	@SuppressWarnings("rawtypes")
	public static String getInlineCrudQueries(Class classe){

		String queryCrud = "";

		String[] qs = getCrudQueries(classe, new String[0]);
		int i=0;

		for(String q : qs){

			queryCrud +=" "+q;
			i++;

			if(i<qs.length)
				queryCrud+=" and ";
		}

		return queryCrud;
	}

	//Injeta a query de filial em query completo. ex: "from Produto where nome like '%Teste%'"
	public static String injectQueryFilial(String query, String queryFilial){

		if(query.contains("ignoreFilial")) {
			query = query.replace("ignoreFilial","");
			return query;
		}

		Object objectInQuery = getObjectFromQuery(query);

		if(!isCrudEntity(objectInQuery.getClass()))
			return query;

		String queryOperador = getQueryOperador();

		if(queryFilial==null)
			queryFilial = getQueryFilial();

		if(queryOperador!=null && queryOperador.length()>0){

			if(queryFilial!=null && queryFilial.length()>0){
				queryFilial+=" and ";
			}
			queryFilial+=queryOperador;
		}

		//Caso não tenha filial definida
		if(queryFilial.length()==0)
			return query;

		String sufix =""+queryFilial+"";

		int posBase = 0;

		String nomeObjeto = objectInQuery.getClass().getSimpleName();

		if(query.toLowerCase().contains("where")){

			sufix+=" and";
			posBase  = query.toLowerCase().indexOf("where")+"where".length();

		}else{

			sufix = " where"+sufix;
			posBase = query.indexOf(nomeObjeto)+nomeObjeto.length();
		}

		String novaQuery = query.substring(0,posBase)+sufix+query.substring(posBase);
		novaQuery = novaQuery.trim();

		return novaQuery;

	}

	public static String getQueryFilial(){

		AccountUserDetails user = SystemUtil.getCurrentUserDetails();

		String query ="";

		long idFilial  = 0;

		if(user!=null && user.getAccount()!=null){

			idFilial = user.getAccount().getCurrentFilialId();
		}

		//TODO Query para filial relacionada, se houver
		if(idFilial!=0)
			query=" (idFilial = "+idFilial+" or idFilial=0  or allFilials=1) ";

		return query;

	}

	public static String getQueryOperador(){

		AccountUserDetails user = SystemUtil.getCurrentUserDetails();
		String query ="";

		long idOperador  = 0;

		if(user!=null && user.getAccount()!=null){

			idOperador = user.getAccount().getCurrentOperadorId();
		}

		if(idOperador!=0)
			query+=" idOperador = "+idOperador+" ";

		return query;

	}

	//Verifica se um objeto e CrudClass
	public static  boolean isCrudEntity(Class classe){

		return CrudClass.class.isAssignableFrom(classe);
	}

	//Extrai o objeto definido em um query (Ex: "Select id from Produto where...")
	public static <E> Object getObjectFromQuery(String query){

		int first = query.lastIndexOf("from ");
		String texto = query.substring(first,query.length());
		texto = texto.replace("from ","");

		if(texto.indexOf(" ")!=-1)
			texto = texto.substring(0,texto.indexOf(" "));

		texto = texto.toLowerCase()+"."+texto;

		try{

			return Class.forName(texto).newInstance();
		}catch(Exception e){

			return null;
		}

	}

	public static String getDbConnectionString(){

		if(dbURL==null){
			dbURL = System.getProperty("JDBC_CONNECTION_STRING");

			if(dbURL==null)
				dbURL = System.getenv("JDBC_CONNECTION_STRING");

			if(dbURL==null){
				dbURL = "jdbc:mysql://localhost/";

			}

		}

		return dbURL;
	}

	//Recupera uma conexão genérica para o banco de dados que não está associada a um Data Source
	public  Connection getConnection(){

		try {
			if(connection==null || connection.isClosed())
				try {
					connection = 	DriverManager.getConnection(getDbConnectionString(), getHibernateConfiguration().getProperty("hibernate.connection.username"), getHibernateConfiguration().getProperty("hibernate.connection.password"));
				} catch (SQLException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return connection;
	}


	//Recupera o data source de acordo com o tenantIdentifier
	public  DataSource getDataSource(String tenantIdentifier) {
		ComboPooledDataSource defaultDataSource;

		PooledDataSource pds = C3P0Registry.pooledDataSourceByName(tenantIdentifier);
		if(pds==null){
			defaultDataSource = new ComboPooledDataSource(tenantIdentifier);
			defaultDataSource.setJdbcUrl(DataBaseUtil.getDbConnectionString()+ tenantIdentifier);
			defaultDataSource.setUser(getHibernateConfiguration().getProperty("hibernate.connection.username"));
			defaultDataSource.setPassword(getHibernateConfiguration().getProperty("hibernate.connection.password"));
			defaultDataSource.setTestConnectionOnCheckout(true);
			defaultDataSource.setMaxConnectionAge(10000);
			defaultDataSource.setPreferredTestQuery( "SELECT 1" );
			try {
				defaultDataSource.setDriverClass("com.mysql.jdbc.Driver");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			//Atualiza o schema para o usuário
			try {
				updateSchema(defaultDataSource, tenantIdentifier);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

			return defaultDataSource;

		}

		return pds;

	}

	//Verifica se existe determinado schema na base
	public boolean existeSchema(String nomeSchema) throws SQLException{

		if(!nomeSchema.contains(DB_PREFIX))
			nomeSchema = DB_PREFIX + nomeSchema;

		return  getConnection().createStatement().executeQuery("SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = '"+nomeSchema+"'").next();

	}

	public void createOrUpdateSchema (UserSystem user) throws SQLException{

		String nomeDb = DB_PREFIX + user.getLogin();
		
		
	  
		//Verifica se já existe schema criado
		if(existeSchema(nomeDb)){
			//Atualiza o banco de dados
			updateSchema((ComboPooledDataSource) getDataSource(nomeDb),nomeDb);
			return;
		}
		
		

		

		Statement stm = getConnection().createStatement();

		String queryCreateSchema = "CREATE SCHEMA  `"+nomeDb+"`";
		
		System.out.println("queryCreateSchema: "+queryCreateSchema);
		
		// Criar o Schema para o novo usuário
		stm.execute(queryCreateSchema);
		
		updateSchema((ComboPooledDataSource) getDataSource(nomeDb),nomeDb);
		
		stm.execute("USE " + nomeDb);

		//Popular com dados padrão		rdp.populate(connection);
		
		String query = "insert into pessoa(tipo_pessoa, disable,defaultPassword, login, senha) values('operador_sistema',0,0,':login', ':senha')";
		query = query.replace(":login", user.getLogin());
		query = query.replace(":senha", "123");
		

		stm.execute(query);

		//Atualiza o banco de dados
		updateSchema((ComboPooledDataSource) getDataSource(nomeDb),nomeDb);

		try{
			stm.close();
		}
		catch(Exception e){

		}

	}

	public   void updateSchema(ComboPooledDataSource dataSource, String tenantId ) throws SQLException {

		LocalSessionFactoryBean sessionFactory  = (LocalSessionFactoryBean) SpringUtil.getBean("&sessionFactorySchemaManager");

		sessionFactory.setDataSource(dataSource);

		Configuration _configuration = sessionFactory.getConfiguration();

		if(_configuration != null && dataSource != null) {

			// Get a local configuration to configure
			final Configuration tenantConfig = _configuration;

			// Set the properties for this configuration
			Properties props = new Properties();

			//Seleção de schema para as operações
			props.put(Environment.DEFAULT_SCHEMA, tenantId);

			//Url de acordo com o tenant especificado
			props.put("hibernate.connection.url", dataSource.getJdbcUrl());

			tenantConfig.addProperties(props);

			//Outras configurações do hibernate
			tenantConfig.addProperties(getHibernateConfiguration().getProperties());

			// Get connection
			Connection connection = DriverManager.getConnection(dataSource.getJdbcUrl(), dataSource.getUser(), dataSource.getPassword());

			// Create the schema
			connection.createStatement().execute("CREATE DATABASE IF NOT EXISTS " + tenantId + "");

			// Run the schema update from configuration
			SchemaUpdate schemaUpdate = new SchemaUpdate(tenantConfig);
			schemaUpdate.execute(true, true);


		} else if(_configuration == null) {

			System.out.println("Configuração na Espeficada para " + dataSource.getUser());

		} else if(dataSource == null) {

			System.out.println("Data Source não especificado para  " +dataSource.getUser());

		}
	}

}