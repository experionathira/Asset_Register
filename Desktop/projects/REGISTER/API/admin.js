var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require('cors');
var nodemailer=require('nodemailer');
var md5=require('md5');
var conn=mysql.createConnection({host:"localhost",user:"root",password:"aliya",database:"asset"});
var app = express();
var jwt = require('jsonwebtoken');
var adminRouter = express.Router(); 
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
var emails = require('./mail.js');

/*--------------FOR ADDING A NEW USER TO A DEPARTMENT----------------------------------------------*/
adminRouter.post('/addUser',function(req, res){

	var token=req.headers.authorization;
	token=JSON.parse(token);
	var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
	 	if(err){
	 		console.log("token expired");
	 	}
	 	else{
	 		if(decoded.usertype == token.role){
	        	var eid=req.body.eid;
				var dept=req.body.department;
				var password=req.body.password;
				password2=md5(password);
				var email=req.body.email;
				var flag=1;
				var js={"status":"403","message":"","token":""};
				var obj={EID:eid,DeptID:dept,Password:password2,Flag:flag};
				if(eid.length==""||password.length==""||dept.length==""||email.length==""||eid.length>8||password.length>32){
					js.status=403;
					js.message=err;
					res.send(js);
				}
				else{
					conn.query("insert into user(EID,DeptID,Password,Flag,Email) values('"+eid+"','"+dept+"','"+password2+"','"+flag+"','"+email+"')",function(err,rows){
							var js={"status":"","message":""};
							if(err){
								console.log(err);
								js.status=403;
								js.message=err;
								res.send(js);
							}
							else{
								js.status=200;
								js.message="added";
								var text = 'Dear Employee,\n\nYou can now access the Asset Register system.Your login credentials are User id  '+eid+' and password  '+password+'\n\nRegards,\nAsset Register' ;
								console.log("EMAIL",email);
								emails.sendMail(email,text,text);
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
/*--------------FOR GENERATING THE STATISTICS OF ALL DEPARTMENTS-----------------------------------------*/
adminRouter.get('/statistics/all',function(req, res){

	var token=req.headers.authorization;
	token=JSON.parse(token);
	var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
		if(err){
		 		console.log("token expired");
		}
		else{
		 	
		 	if(decoded.usertype == token.role){
		    
				conn.query("select count(AssetID) as count,category.CategoryID from assets,category where  assets.CategoryID=category.CategoryID group by category.CategoryID " ,function(err,rows){
					var js={"status":"","message":""};
					if(err){
						console.log(err);
						js.status=403;
						js.message="failed";
						res.send(js);
					}
					else{
						var data=JSON.stringify(rows);
						console.log(rows);
						var json=JSON.parse(data);
						console.log(json);
						res.send(json);
					}
				});
			}
			else{
				    console.log("invalid user");
			}
		}
	});	
});

/*--------------FOR GENERATING THE STATISTICS OF A DEPARTMENT-----------------------------------------*/
adminRouter.get('/statistics/:dep',function(req, res){

	var dept=req.params.dep;
	var token=req.headers.authorization;
	token=JSON.parse(token);
	console.log(dept);
	var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
		if(err){
		 		console.log("token expired");
		}
		else{
		 	
		 	if(decoded.usertype == token.role){
		    
				conn.query("select count(AssetID) as count,category.CategoryID from assets,category where assets.DeptID = '"+dept+"' AND assets.CategoryID=category.CategoryID group by category.CategoryID " ,function(err,rows){
					var js={"status":"","message":""};
					if(err){
						console.log(err);
						js.status=403;
						js.message="failed";
						res.send(js);
					}
					else{

						var data=JSON.stringify(rows);
						var json=JSON.parse(data);
						console.log(json);
						
						conn.query("select AssetName,CategoryID,Price,Location from assets where DeptID = '"+dept+"' order by CategoryID",function(err,rows){
								var data2=JSON.stringify(rows);
								var details=JSON.parse(data2);
								var details2;
								var obj={json:json,details:details};
								res.send(obj);
						});
						
					}
				});
			}
			else{
				    console.log("invalid user");
			}
		}
	});	
});

/*--------------FOR GENERATING THE DETAILS OF ASSET ADDED OVER A PERIOD----------------------------------------*/
adminRouter.post('/assetStatistics',function(req, res){

	var start=req.body.startdate;
	var end=req.body.enddate;
	 conn.query("select AssetName,CategoryID,CONCAT(EXTRACT(DAY FROM Date),'/',EXTRACT(MONTH FROM Date),'/',EXTRACT(YEAR FROM Date)) Date,Price,Location from assets where  Date>=? and Date<= ?",[start,end],function(err,rows){
		var js={"status":"","message":""};
		if(err){
			console.log(err);
		}
		else{

			var data=JSON.stringify(rows);
			console.log(rows);
			var json=JSON.parse(data);
			console.log(json);
			res.send(json);
		}
	 });
			
});

module.exports = adminRouter;
