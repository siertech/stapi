package com.siertech.stapi.teste;
import org.springframework.stereotype.Repository;

import com.siertech.stapi.model.GenericDAO;

@Repository
public class TestDefinitionDAO extends GenericDAO<TestDefinition> {

	public TestDefinitionDAO() {
		super(TestDefinition.class);
		// TODO Auto-generated constructor stub
	}
	

}


