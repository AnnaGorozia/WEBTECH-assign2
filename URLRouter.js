module.exports = URLRouter;

function URLRouter() {
    var routers = {};
    
    this.add = function(route, callbacks, errorHandler){
	var regexp = "^"+route;
	var params = [];
	for(var i = 0; i < route.length; i++){
	    if(route.charAt(i)==='{'){
		for(var j = i; j < route.length; j++){
		    if(route.charAt(j)===':'){
			var paramName = route.substr(i+1,j-(i+1));
			for(var k = j; k < route.length; k++){
			    if(route.charAt(k) === "}"){
				var type = route.substr(j+1,k-(j+1));
				params.push(paramName);
				if(type === "n"){
				    regexp = regexp.replace("{"+paramName+":"+type+"}", "([0-9]+)");
				}else{
				    regexp = regexp.replace("{"+paramName+":"+type+"}", "([a-zA-Z]+)");
				}
				i = k;
				break;					
			    }
			}
			break;
		    }
		}	
	    }	
	}	
	regexp = regexp + "$";
	regexp = regexp.split("/").join("\\/");
	var regularExp = new RegExp(regexp);
	var routerObj = {
	    regularExpresion: regularExp,
	    callback: callbacks,
	    errorHandler: errorHandler,
	    parameters: params
	}
	routers[route] = routerObj;
    }
    
    this.remove = function(route){
	for(var v in routers){
	    if(v === route){
		delete routers[route];
		return true;
	    }	
	}
	return false;
    }	
    
    
    this.handle = function(request){
	var url = request.url;
	for(var v in routers){
	    var router = routers[v];
	    var reg = router.regularExpresion;
	    if(reg.test(url)){
		var params = {};	
		var p = router.parameters;
		url.replace(reg, function(){
		    for(var i=0; i<p.length; i++){
			var param = arguments[i+1];
			var paramName = p[i];
			params[paramName] = param; 
		    }
		    
		});
		returningObj = {
		    callback: router.callback,
		    errorHandler: router.errorHandler,
		    parameters: params
		}
		return returningObj;
	    }
	}
    }
}
