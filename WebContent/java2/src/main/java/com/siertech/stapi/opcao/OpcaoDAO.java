package com.siertech.stapi.opcao;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.siertech.stapi.model.GenericDAO;

@Repository
public class OpcaoDAO extends GenericDAO<Opcao> {

	public OpcaoDAO( ) {
		super(Opcao.class);
	}
	
	@SuppressWarnings("unchecked")
	public List<String> getAllDescricoes() {
		
		Query q = getSessionFactory().getCurrentSession().createSQLQuery("select descricao from opcao");
		
		return (ArrayList<String>) q.list();
	}
	
}
