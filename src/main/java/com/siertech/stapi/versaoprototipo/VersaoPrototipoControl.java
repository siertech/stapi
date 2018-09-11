package com.siertech.stapi.versaoprototipo;
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
public class VersaoPrototipoControl extends GenericControl<VersaoPrototipo> {
	
	
	@Autowired
	private VersaoPrototipoService versaoprototipoService;
	

	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/versaoprototipo/change-attr-value", method=RequestMethod.GET)
    public AjaxResponse<VersaoPrototipo> changeAttr(@RequestParam Long  id, @RequestParam String key, @RequestParam String value){
		
		versaoprototipoService.changeAttr(id, key, value);
		return null;
	}
	
	
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/versaoprototipo/add/", method=RequestMethod.POST)
    public AjaxResponse<VersaoPrototipo> addOrUpdate(@RequestBody VersaoPrototipo item){
		
		return addOrUpdateAndRespond(item);
	}
	
	@Override
	@RequestMapping(value="/versaoprototipo", method=RequestMethod.GET)
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
    public AjaxResponse<VersaoPrototipo> getAll(){
		
		return this.getAllAndRespond();

	}
	
	//Por id
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/versaoprototipo/get", method= RequestMethod.GET)
	public AjaxResponse<VersaoPrototipo> getById(@RequestParam Long id){
		
		
		return getByIdAndRespond(id);
   	
	}
	
	//Atrav s de uma busca
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/versaoprototipo/busca", method= RequestMethod.GET)
	public AjaxResponse<VersaoPrototipo> getLike(@RequestParam String propriedade,@RequestParam String query){
		
		return getLikeAndRespond(propriedade,query);
		
	}
	
	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/versaoprototipo/delete/", method=RequestMethod.POST)
    public AjaxResponse<VersaoPrototipo> delete(@RequestBody long[] ids){
		
		versaoprototipoService.deleteByIds(ids);
		
		return null;

	}


	@Override
	@JsonView(com.siertech.stapi.util.Views.Public.class)
	@ResponseBody
	@RequestMapping(value="/versaoprototipo/busca/map", method= RequestMethod.GET)
	public AjaxResponse<VersaoPrototipo> getLikeMap(@RequestParam String[] qs,@RequestParam int pagina,@RequestParam int max,@RequestParam String extra) {
		
		return getLikeMapAndRespond(qs, pagina, max, extra);
	}
	
	
}
