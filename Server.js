module.exports = Server;

function Server(URLRouter, port){
    var http = require("http");
    var server = http.createServer(function(request, response){		
	var router = URLRouter.handle(request);
	if(router === undefined){
	    response.writeHead(404, {"Content-Type": "text/html"});
	}else{
	    var callbacks = router.callback;
	    var params = router.parameters;
	    try{
		if(request.method === "GET"){
		    callbacks.get(request, response, params);
		}else if(request.method === "POST"){
		    callbacks.post(request, response, params);
		}else if(request.method === "DELETE"){
		    callbacks.delete(request, response, params);
		}
	    }catch(error){
		var errorHandlers = router.errorHandler;
		if(errorHandlers === undefined){
		    response.writeHead(404, {"Content-Type": "text/html"});
		    response.end();
		}else{
		    errorHandlers(error);
		}
	    }
	}
    });
    server.listen(port);
}
