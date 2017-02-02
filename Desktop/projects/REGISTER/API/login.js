var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var nodemailer=require('nodemailer');
var path=require('path');
var cors = require('cors');
var md5=require('md5');
var conn=mysql.createConnection({host:"localhost",user:"root",password:"aliya",database:"asset"});
var app = express();
var jwt = require('jsonwebtoken');
var userRouter = express.Router(); 
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


var employee = require('./user');
var email = require('./mail.js');
var admin = require('./admin');
app.use('/',express.static(__dirname+'./../CLIENT'));
app.use('/',employee);
app.use('/',admin);
app.use('/',userRouter);


/*------------------------------FOR LOGIN----------------------------------------------------*/
userRouter.post('/',function(req, res){

	var id=req.body.eid;
	var pass=req.body.password;
	if(id.length==""||pass.length==""||id.length>8||pass.length>32){

		console.log("error");
		var js={"status":"403","message":"","token":""};
		res.send(js);
		return false;
	}
	else{

		conn.query("select EID,Password,Flag,DeptID from user where eid='"+id+"' and password='"+pass+"'",function(err,rows){
			var js={"status":"","message":"","usertype":null,"deptid":"","eid":""};
			if(rows.length == 0 ){

				js.status='403';
				js.message="failed";
				res.send(js);
				
			}
			else{

				var data=JSON.stringify(rows);
				var json=JSON.parse(data);
				var js={"status":"","message":"","usertype":null,"deptid":"","eid":""};
				if(rows.length==1){
						js.status='200';
						js.message="success";
						if(json[0].Flag==0){
							js.usertype="admin";
						}
						else{
							js.usertype="user";
						}
				}
				var token = jwt.sign({ usertype: js.usertype}, 'aliya',{expiresIn:60*10000});
				js.token=token;
				js.eid=json[0].EID;
				js.deptid=json[0].DeptID;
				console.log(token);
				res.send(js);
			}
		});
	}	
});

/*----------------------------------FORGOT PASSWORD----------------------------------------------*/
userRouter.post('/forgotPassword',function (req, res){
    var userid=req.body.userid;
    var js1={"message":""};
    
        conn.query('select EID,Email from user where EID=?',[userid],function(err,rows){
            if(!err){
                if(rows.length > 0){
                    var data1=JSON.stringify(rows);
                    var json1=JSON.parse(data1);
                    var token2 = jwt.sign({ eid: json1[0].EID}, 'aliya',{expiresIn:60*10000});
                    var text='http://192.168.1.236/REGISTER/CLIENT/resetpassword.html?'+token2;
                    email.sendMail(json1[0].Email,token2,text);
                    js1.message="Password reset link is sent to your mail";
                    console.log(js1);
                    res.send(js1);
                }
                else {
                    js1.message="Invalid EID";
                    console.log(js1);
                    res.send(js1);
                }
            }
            else{
                console.log("error in forgot possword");
            }    
        });
});

/*----------------------------------TO FETCH THE RECORDS----------------------------------------------*/
userRouter.get('/fetch/:did',function(req, res){
	
	 
	 var token=req.headers.authorization;
	 console.log(token);
	 var did=req.params.did;
	 token=JSON.parse(token);
	 var decoded = jwt.verify(token.token, 'aliya',function(err,decoded){
	 	if(err){
	 		console.log("token expired");
	 	}
	 	else{
	 		if(decoded.usertype == token.role){
	        
			  console.log("valid user"+did);
			  conn.query("select AssetID,AssetName,CategoryID,DeptID,CONCAT(EXTRACT(DAY FROM Date),'/',EXTRACT(MONTH FROM Date),'/',EXTRACT(YEAR FROM Date)) Date,EID,Price,Location,Description from assets  where DeptID='"+did+"'",function(err,rows){
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

/*-----------------------------------------FORGOT PASSWORD----------------------------------------------------*/
userRouter.post('/forgot',function(req, res){

	var password=req.body.password;
	var token=req.body.token;
	password=md5(password);
	var js={"status":"","message":"","token":""};
	if(password.length==""||password.length>32){
		
		console.log("error");
		js.status=403;
		res.send(js);
		js.message="Password Change Failed";
		return false;
	}
	else{
	
		var decoded = jwt.verify(token, 'aliya',function(err,decoded){
			if(err){
				console.log("token expired");
			}
			else{
				conn.query('UPDATE user set Password=? where EID=?',[password,decoded.eid],function(err,rows){
					var data=JSON.stringify(rows);
					var json=JSON.parse(data);
					js.status=200;
					js.message="Password Changed Successfully";
					res.send(js);
				});
			}
		});
	}	
});

var server = app.listen(8088,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log("Listening at %s on port %s", host, port);
});
