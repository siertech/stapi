package com.siertech.stapi.prototipo;
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
public class PrototipoControl extends GenericControl<Prototipo> {
	
	
	@Autowired
	private PrototipoService prototipoService;
	

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/prototipo/change-attr-value", method=RequestMethod.GET)
    public AjaxResponse<Prototipo> changeAttr(@RequestParam Long  id, @RequestParam String key, @RequestParam String value){
		
		prototipoService.changeAttr(id, key, value);
		return null;
	}
	
	
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/prototipo/add/", method=RequestMethod.POST)
    public AjaxResponse<Prototipo> addOrUpdate(@RequestBody Prototipo item){
		
		return addOrUpdateAndRespond(item);
	}
	
	@Override
	@RequestMapping(value="/prototipo", method=RequestMethod.GET)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
    public AjaxResponse<Prototipo> getAll(){
		
		return this.getAllAndRespond();

	}
	
	//Por id
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/prototipo/get", method= RequestMethod.GET)
	public AjaxResponse<Prototipo> getById(@RequestParam Long id){
		
		
		return getByIdAndRespond(id);
   	
	}
	
	//Atrav s de uma busca
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/prototipo/busca", method= RequestMethod.GET)
	public AjaxResponse<Prototipo> getLike(@RequestParam String propriedade,@RequestParam String query){
		
		return getLikeAndRespond(propriedade,query);
		
	}
	
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/prototipo/delete/", method=RequestMethod.POST)
    public AjaxResponse<Prototipo> delete(@RequestBody long[] ids){
		
		prototipoService.deleteByIds(ids);
		
		return null;

	}


	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/prototipo/busca/map", method= RequestMethod.GET)
	public AjaxResponse<Prototipo> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}
	
	
}
