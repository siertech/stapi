package com.siertech.stapi.usersystem;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.stereotype.Repository;

import com.siertech.stapi.database.DataBaseUtil;
import com.siertech.stapi.model.GenericDAO;

@Repository
public class UserSystemDAO extends GenericDAO<UserSystem>  {

	public UserSystemDAO() throws SQLException {

		super(UserSystem.class);

	}

	public UserSystem getByLogin(String login){

		String dadosLogin[] = login.split("@");
		int posicaoDadosEmpresa = 0;
		if(dadosLogin.length>1)
			posicaoDadosEmpresa = 1;
			 
		String dbEmpresa  = DataBaseUtil.DB_PREFIX+dadosLogin[posicaoDadosEmpresa];
		String usuarioEmpresa = dadosLogin[0];
		Connection con = null;

		UserSystem user= null;
		PreparedStatement stm=null;
		try {
			con = new DataBaseUtil().getDataSource(dbEmpresa).getConnection();
			stm = con.prepareStatement("select * from pessoa where login=?");
			stm.setString(1,usuarioEmpresa);
			ResultSet res = stm.executeQuery();

			if(res.next()){
				user = new UserSystem();
				user.setId(res.getLong("id"));
				user.setNome(res.getString("nome"));
				user.setPermissoes(res.getString("permissoes"));
				user.setFiliaisPermitidas(res.getString("filiaisPermitidas"));
				user.setBanco(dbEmpresa);
				user.setLogin(login);
				user.setPassword(res.getString("senha"));

			}

		} catch (SQLException e) {

			e.printStackTrace();
		}finally {
			try {
				if(con!=null)
					con.close();

				if(stm!=null)
					stm.close();
			} catch (SQLException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return user;

	}

}
