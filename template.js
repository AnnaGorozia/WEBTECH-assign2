var URLRouter = require("./URLRouter");
var Server = require("./Server");
var fileReader = require('fs');
var router = new URLRouter();

router.add("/users/{id:n}/permissions/{permName:s}", 
	   {
	       get: function(request, response, params){
		   response.writeHead(200, {"Content-Type": "text/html"});
		   response.write(params.id + '<br/>' + params.otherParam);
		   response.end();
	       }
	   },
	   function(error, request, response){
	       response.writeHead(500, {});
	       response.end();
	   });

router.add("/page/{id:n}/{otherParam:s}/{other:s}", {
    get: function(request, response, params){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(params.id + '<br/>' + params.otherParam + '<br/>' + params.other);
	response.end();
    },
    delete: function(request, response, params){
	response.writeHead(200, {"Content-Type": "text/html"});
	response.end();
    }
},
	   function(error, request, response){
	       response.writeHead(404, {"Content-Type": "text/html"});
	       response.end();
	   });
router.add("/Home/{filename:s}/{filetype:s}",
	   {
	       get: function(request, response, params){
		   var name = params.filename;
		   var type = params.filetype;
		   fileReader.readFile(name, function(error, data){
		       if(!error){
			   var contentType = "";
			   if(type === "html" || type === "txt" || type === "js" || type === "css"){
			       
			       contentType = "text/" + type;
			   }else  if(type === "jpg" || type === "png"){
			       contentType = "image/" + type;
			   }
			   response.writeHead(200, {"Content-Type": contentType});
			   response.write(data);
			   response.end();
			   
		       }else{
			   response.writeHead(500, {});
			   response.end();
		       }
		   });
	       },
	   },
	   function(error, request, response){
	       response.writeHead(404, {"Content-Type": "text/html"});
	       response.end();
	   });


var server = new Server(router, 22222);
