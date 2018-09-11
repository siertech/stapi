package com.siertech.stapi.projecao;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import com.siertech.stapi.database.DataBaseUtil;
import com.siertech.stapi.model.GenericDAO;
import com.siertech.stapi.system.SystemUtil;


@Repository
public class ProjecaoDAO extends GenericDAO<Projecao> {

	public ProjecaoDAO() {
		super(Projecao.class);
		// TODO Auto-generated constructor stub
	}
	
	public void reorderItems(String objectName, ArrayList<HashMap<String, String>> itens) {

        String query  = "update from "+objectName+" set orderIndex=:orderIndex where id=:id";
		Query q = getSessionFactory().getCurrentSession().createQuery(query);
		for(HashMap<String, String> item : itens){
			q.setLong("id", Long.parseLong(item.get("id")));
			q.setString("orderIndex", item.get("orderIndex")+"");
			q.executeUpdate();
		}
		
	}
	
   @SuppressWarnings("unchecked")
   public ArrayList<Map<String,Object>> getProjecoes (String objeto, ArrayList<String> qs,String extra,String columns, String groupBy, int max){
	   
	   
	  String[] qs_ =  DataBaseUtil.getCrudQueries(SystemUtil.getClass(objeto), qs.toArray(new String[qs.size()] ));
	  qs = new ArrayList<String>(Arrays.asList(qs_));
	  
	  
	  String selectDeclaration = " ";
	  
	  if(columns.equals("*"))
		  columns="";
	  
	  if(columns.length()>0)
		  selectDeclaration=" select ";
	   
	   String query = selectDeclaration+columns+" from "+objeto+" where ";
	   String condicao ="";
	   int i=0;
	   for(String q :qs){

			if(q.length()==0 || q==null)
				continue;

			condicao+=" "+q+" ";
			i++;

			if(i<qs.size())
				condicao+=" and ";

		}
	   
	    query+=condicao;
	    
	   

	    if(groupBy!=null && !groupBy.equals("null") && groupBy.length()>0)
	      query+=" group by "+groupBy;
	    
	    
        if(extra!=null && extra.length()>0){
	    	
	    	query+=" "+extra;
	    }
	    
    	query  = query.replace("and and","and");
		query  = query.replace("and  and","and");
		query  = query.replace("and   and","and");
        
        System.out.println("Query a ser executada em getProjecoes: "+query);
	    
	    Query q = this.getSessionFactory().getCurrentSession().createQuery(query);
	    q.setMaxResults(max);
	    return (ArrayList<Map<String,Object>>) q.list();
	   
	}
   
   @SuppressWarnings("unchecked")
   public ArrayList<Map<String,Object>> executeQuery(String query){
	   
	    //Injeção da query de filial
	    query = DataBaseUtil.injectQueryFilial(query, null);
	    Query q = this.getSessionFactory().getCurrentSession().createQuery(query);
	    return (ArrayList<Map<String,Object>>) q.list();
	   
	}
   
   @SuppressWarnings("unchecked")
   public ArrayList<Map<String,Object>> executeSQLQuery(String query){
	   
	    Query q = this.getSessionFactory().getCurrentSession().createSQLQuery(query);
	    return (ArrayList<Map<String,Object>>) q.list();
	   
	}
	
	
	
}
