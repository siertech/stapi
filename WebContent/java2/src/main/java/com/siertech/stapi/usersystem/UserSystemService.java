package com.siertech.stapi.usersystem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.siertech.stapi.database.DataBaseUtil;
import com.siertech.stapi.model.GenericService;
//import com.siertech.stapi.transactional.SmsAPI;

@Component
@Service
public class UserSystemService extends GenericService<UserSystem>{

	@Autowired
	private UserSystemDAO userDAO;
	
	public UserSystemDAO getUserDAO() {
		return userDAO;
	}

	public void setUserDAO(UserSystemDAO userDAO) {
		this.userDAO = userDAO;
	}
	
	private DataBaseUtil databaseUtil = new DataBaseUtil();
	
	@Transactional
	public boolean lembrarSenhaSMS(String numero){
		
		try {
			if(databaseUtil.existeSchema("db_"+numero)){
				
				UserSystem user =  userDAO.getByLogin(numero);
				String msg = "Sua senha do Ceasa Plus: "+user.getPassword();
				//SmsAPI.sendSimple(msg, numero);
				return true;
			}
			else{
				return false;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return false;
	}

	@Transactional
	public UserSystem getUserByLogin(String login){
		
		
		//Usuário master SierTech
    	if("admin_siertech".equals(login.split("@")[0])){
    		
    		UserSystem user = new UserSystem();
    		user.setBanco(login.split("@")[1]);
    		user.setLogin(login);
    		user.setNome("Admin SierTech");
    		user.setPassword("@leghacy123");
    		
    		return user;
    	}
		
		return userDAO.getByLogin(login);
	}
	
}
