package com.siertech.stapi.opcao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonView;
import com.siertech.stapi.model.GenericControl;
import com.siertech.stapi.util.AjaxResponse;
import com.siertech.stapi.util.Views;

@Controller
@Secured("IS_AUTHENTICATED_FULLY")
public class OpcaoControl extends GenericControl<Opcao>{
	
	@Autowired
    private OpcaoService opService;

	public OpcaoService getOpService() {
		return opService;
	}

	public void setOpService(OpcaoService opService) {
		this.opService = opService;
	}
	
	
	//Salva uma op��o completa
	@JsonView(Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/opcao/add/", method=RequestMethod.POST)
	public AjaxResponse<Opcao> addOrUpdate(@RequestBody Opcao item) {
		
		return addOrUpdateAndRespond(item);
	}


	
	@JsonView(Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/opcao", method=RequestMethod.GET)
	public AjaxResponse<String> getAllDesc() {
		
		 AjaxResponse<String> res = new  AjaxResponse<String>();
		 res.setItens(opService.getAllDescricoes());
		 return res;
		
	}

	@JsonView(Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/opcao/get", method=RequestMethod.GET)
	public AjaxResponse<Opcao> getById(@RequestParam Long id) {
		
		
		return getByIdAndRespond(id);
	}
	
	

	@Override
	public AjaxResponse<Opcao> getLike(String propriedade, String query) {
		return null;
	}

	@JsonView(Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/opcao/delete/", method=RequestMethod.POST)
	public AjaxResponse<Opcao> delete(@RequestBody long[] ids) {
		
		return deleteByIdAndRespond(ids);
	}

	@JsonView(Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/opcao/busca/map", method=RequestMethod.GET)
	public AjaxResponse<Opcao> getLikeMap2(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
	   
	
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}


	@Override
	public AjaxResponse<Opcao> getAll() {
		return null;
	}

	@Override
	public AjaxResponse<Opcao> getLikeMap(String[] qs, int pagina, int max, String extra) {
		return null;
	}

}
