package com.siertech.stapi.projecao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.siertech.stapi.model.GenericService;


@Service
public class ProjecaoService extends GenericService<Projecao> {
	
  @Autowired	
  private ProjecaoDAO projDAO;
  
  @Transactional
  public void reorderItems(String objectName, ArrayList<HashMap<String, String>> itens) {
	  
	  projDAO.reorderItems(objectName, itens);
  }
  
  @Transactional
  public ArrayList<Map<String,Object>> executeQuery (String query){
		
	  return projDAO.executeQuery(query);
	  
 }
  
  @Transactional
  public ArrayList<Map<String,Object>> executeSQLQuery (String query){
		
	  return projDAO.executeSQLQuery(query);
	  
 }
	
  @Transactional
  public ArrayList<Map<String,Object>> getProjecoes (String objeto, ArrayList<String> qs,String extra,String columns,String groupBy, int max){
		
	  return projDAO.getProjecoes(objeto, qs,extra, columns,groupBy,max);
	  
 }
}
