app.get('/users/', (req,res)) => {
     let query = "SELECT * FROM users";
     let parameters = [];
     let first = true;
     
     //Handler for id
     if(req.query.id) {
          //Put list of ids into array
          first = false;
          query = query + "WHERE (username = ?";
          parameters.push(ids[0];
          for (let j = 1; j < ids.length; j++) {
               query = query + "OR username = ?";
               parameters.push(ids[j]);
          } //for
          query = query + ")";
          query = query + " AND (username = ?";
          parameters.push(ids[0]);
          for(let j = 1; j < ids.length; j++) {
               query = query + " OR username = ?";
               parameters.push(ids[j]);
          } //for
          query = query + ")";
          
     query = "SELECT"..//Look at prepared statements
     res = db.all(query);
} //app.get

