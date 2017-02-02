var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var nodemailer=require('nodemailer');
var md5=require('md5');
var conn=mysql.createConnection({host:"localhost",user:"root",password:"aliya",database:"asset"});
var app = express();
var jwt = require('jsonwebtoken');
var employeeRouter = express.Router(); 
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var emails = require('./mail.js');

/*----------------------------------TO FETCH THE RECORDS----------------------------------------------*/
employeeRouter.get('/assets/:deptid/:empid',function(req, res){
	
	 
	 var token=req.headers.authorization;
	 console.log(token);
	 var did=req.params.deptid;
	 var eid=req.params.empid;
	 token=JSON.parse(token);
	 var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
	 	if(err){
	 		console.log("token expired");
	 	}
	 	else{
	 		if(decoded.usertype == token.role){
	        
			  console.log("valid user"+did);
			  conn.query("select AssetID,AssetName,CategoryID,DeptID,CONCAT(EXTRACT(DAY FROM Date),'/',EXTRACT(MONTH FROM Date),'/',EXTRACT(YEAR FROM Date)) Date,EID,Price,Location,Description from assets  where EID='"+eid+"' AND DeptID='"+did+"'",function(err,rows){
			  var data=JSON.stringify(rows);
			  var json=JSON.parse(data);
			  res.send(json);
				});
			 }
			 else{
			    console.log("invalid user");
			 }
		}
	});
		
	 	
});

/*----------------------------------FOR INSERTING A NEW ENTRY---------------------------------------------*/
employeeRouter.post('/insert',function(req, res){

	 var token=req.headers.authorization;
	 token=JSON.parse(token);
	 console.log(token);
	 console.log(token.token,token.role);
	 var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
	 	if(err){
	 		console.log("token expired");
	 	}
	 	else{
	 
	 		if(decoded.usertype == token.role){
	        
				var name=req.body.name;
				var cat=req.body.cat;
				var date=req.body.date;
				console.log(date);
				var dept=req.body.deptid;
				var price=req.body.price;
				var location=req.body.location;
				var description=req.body.description;
				var eid=req.body.eid;
				if(name.length==""||cat.length==""||dept.length==""||price.length==""||location.length==""){

					console.log("error");
					var js={"status":"403","message":"","token":""};
					res.send(js);
					return false;
				}
				else{
				
					var obj={AssetName:name,CategoryID:cat,Date:date,DeptID:dept,EID:eid,Price:price,Location:location,Description:description};
					console.log(obj);
					conn.query("insert into assets set ?" ,obj,function(err,result){

						var js={"status":"","message":""};
						if(err){
							console.log(err);
							js.status=403;
							js.message="failed";
							res.send(js);
						}
						 else{

							js.status=200;
							js.message="added";
							var text = 'A new asset '+name+' has been added to department '+dept+' by '+eid ;
							emails.sendMail("aliya.azad@experionglobal.com",'',text);
							res.send(js);
						}
				
					});
			 	}
	  		}

			else{
			    console.log("invalid user");
			}
		}


	});	
});



/*------------------------------TO DELETE AN ENTRY---------------------------------------------------------*/
employeeRouter.delete('/',function(req, res){
	
	 var token=req.headers.authorization;
	 token=JSON.parse(token);
	 var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
	 	if(err){
	 		console.log("token expired");
	 	}
	 	else{
	 		if(decoded.usertype == token.role){
			 	var id=req.body.id;
				conn.query("delete from assets where AssetID=?",[id],function(err,rows){
				var js={"status":"","message":""};
					if(err){
						console.log(err);
						js.status=403;
						js.message="failed";
						res.send(js);
					}

					else{
							js.status=200;
							js.message="deleted";
							res.send(js);
					}
				console.log("deleted values");
					
				 });
			}
			else{
			    console.log("invalid user");
			}
		}
	 });
});

/*--------------FOR GENERATING THE STATISTICS OF A DEPARTMENT-----------------------------------------*/
employeeRouter.post('/changePassword',function(req, res){

	var token=req.headers.authorization;
	token=JSON.parse(token);
	console.log(token);
	console.log(token.token,token.role);
	var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
		if(err){
		 		console.log("token expired");
		}
		else{
		 	
		 	if(decoded.usertype == token.role){
		    
		    	var eid=req.body.empid;
				var curp=req.body.curp;
				var newp=req.body.newp;
				curp=md5(curp);
				newp=md5(newp);
				conn.query("select Password from user where EID=? AND Password=?",[eid,curp],function(err,rows){
					var js={"status":"","message":""};
					console.log(rows);
					if(rows.length==0){
						console.log("invalid pass");
						js.status=403;
						js.message="invalid";
					    res.send(js);
					}
					else{
						var data=JSON.stringify(rows);
						var json=JSON.parse(data);
						console.log(json[0].Password);
						if(curp==json[0].Password){
							conn.query('update user set Password = ? where EID = ?',[newp,eid] ,function(err,rows){
								if(err){
									console.log(err);
									js.status=403;
									js.message="failed";
									res.send(js);
									
								}
								else{
									console.log("success");
									js.status=200;
									js.message="success";
									res.send(js);
									
								}
							});
						}
					}
				
				});
			}
			else{
				    console.log("invalid user");
				    res.end();
			}
		}
	});	
});


module.exports = employeeRouter;


