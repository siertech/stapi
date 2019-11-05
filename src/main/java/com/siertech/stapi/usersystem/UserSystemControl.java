package com.siertech.stapi.usersystem;
import java.sql.SQLException;
import java.util.ArrayList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.config.Config;
import com.siertech.stapi.config.ConfigService;
import com.siertech.stapi.database.DataBaseUtil;
import com.siertech.stapi.filial.Filial;
import com.siertech.stapi.filial.FilialService;
import com.siertech.stapi.model.GenericControl;
import com.siertech.stapi.security.AccountUserDetails;
import com.siertech.stapi.security.LoginData;
import com.siertech.stapi.security.TokenTransfer;
import com.siertech.stapi.security.TokenUtils;
import com.siertech.stapi.security.UserDetailServiceImpl;
import com.siertech.stapi.util.AjaxResponse;


@Controller
public class UserSystemControl extends GenericControl<UserSystem> {

	@Autowired
	@Qualifier("authenticationManager")
	private AuthenticationManager authManager;

	@Autowired
	private UserDetailServiceImpl userDetailService;

	@Autowired
	private ConfigService configService;
	
	@Autowired
	private FilialService filialService;
	
	@Autowired
	private UserSystemService userSystemService;




	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/user/login/", method= RequestMethod.POST)
	public TokenTransfer  login(@RequestBody LoginData item) {

		String usuario = item.getUsuario()+"@"+item.getEmpresa();
		SecurityContextHolder.getContext().setAuthentication(null);
		UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(usuario, item.getSenha());
		Authentication authentication = this.authManager.authenticate(authenticationToken);
		AccountUserDetails userDetails = userDetailService.loadUserByUsername(usuario);
		SecurityContextHolder.getContext().setAuthentication(authentication);
		ArrayList<Config> configs =  configService.getAll();
		Config configUsuario = new Config();
		if(configs.size()>0){
		
			configUsuario = configs.get(0);
		}
		
		ArrayList<Filial> filiais = filialService.getAll();
		
		System.out.println("Config usuario aqui: ");
		System.out.println(configUsuario);
		
	
		
		return new TokenTransfer(TokenUtils.createToken(userDetails),userDetails.getAccount(),configUsuario, new Long(0), filiais);

	}
	
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cadastrar-usuario", method= RequestMethod.GET)
	public AjaxResponse<UserSystem> cadastrarUsuario(@RequestParam String login) {

		AjaxResponse<UserSystem> res= new AjaxResponse<UserSystem>();

		//Somente se o schema para  o usuário ainda não foi criado
		//Recupera o usuário de acordo com o 'login' informado em user
		try {

			UserSystem user = new UserSystem();
			user.setNome("Admin");
			user.setLogin(login);

			//Adiciona um novo schema no sistema
			new DataBaseUtil().createOrUpdateSchema(user);

		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return res;
	}

	@Override
	public AjaxResponse<UserSystem> addOrUpdate(UserSystem item) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getLike(String propriedade, String query) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> delete(long[] ids) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public AjaxResponse<UserSystem> getLikeMap(String[] qs, int pagina, int max, String extra) {
		// TODO Auto-generated method stub
		return null;
	}



}
