// Node.js program to demonstrate the 
// response.write() Method
  
// Importing http module
var http = require('http');
  
// Setting up PORT
const PORT = process.env.PORT || 3000;
  
// Creating http Server
var httpServer = http.createServer(function(request, response){
  
  // Writing string data
  response.write("Heyy geeksforgeeks ", 'utf8', () => {
      console.log("Writing string Data...");
  });
  
  // Prints Output on the browser in response
  response.end(' ok');
});
  
// Listening to http Server
httpServer.listen(PORT, () => {
   console.log("Server is running at port 3000...");
});