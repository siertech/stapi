package com.siertech.stapi.cliente;
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

@Controller
@Secured("IS_AUTHENTICATED_FULLY")
public class ClienteControl extends GenericControl<Cliente> {
	
	
	@Autowired
	private ClienteService clienteService;
	

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/change-attr-value", method=RequestMethod.GET)
    public AjaxResponse<Cliente> changeAttr(@RequestParam Long  id, @RequestParam String key, @RequestParam String value){
		
		clienteService.changeAttr(id, key, value);
		return null;
	}
	
	
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/add/", method=RequestMethod.POST)
    public AjaxResponse<Cliente> addOrUpdate(@RequestBody Cliente item){
		
		return addOrUpdateAndRespond(item);
	}
	
	@Override
	@RequestMapping(value="/cliente", method=RequestMethod.GET)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
    public AjaxResponse<Cliente> getAll(){
		
		return this.getAllAndRespond();

	}
	
	//Por id
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/get", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getById(@RequestParam Long id){
		
		
		return getByIdAndRespond(id);
   	
	}
	
	//Atrav s de uma busca
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/busca", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getLike(@RequestParam String propriedade,@RequestParam String query){
		
		return getLikeAndRespond(propriedade,query);
		
	}
	
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/delete/", method=RequestMethod.POST)
    public AjaxResponse<Cliente> delete(@RequestBody long[] ids){
		
		clienteService.deleteByIds(ids);
		
		return null;

	}


	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/cliente/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Cliente> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}
	
	
}
