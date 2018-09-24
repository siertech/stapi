package com.siertech.stapi.util;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;




import org.apache.http.util.EntityUtils;
import org.hibernate.cfg.Configuration;
import org.json.JSONObject;

import com.siertech.stapi.cliente.ClienteDAO;
import com.siertech.stapi.transactional.SendEmail;

public class Teste {


	public static void main(String[] args){

		ClienteDAO dao = (ClienteDAO) SpringUtil.getBean("ClienteDAO");
		
		System.out.print(dao.getAll());

	}


}
