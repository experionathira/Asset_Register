var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var deptid=localStorage.getItem('deptid');
var empid=localStorage.getItem('eid');
var httpObj=new	XMLHttpRequest();

/*---------------------TO CONFIRM IF USER WANTS TO LOGOUT FROM THE PAGE-------------------------*/
function logout(){
    bootbox.confirm("Do you want to logout?", function(result){ 
			if(result){
			  localStorage.removeItem('token');
      		  localStorage.removeItem('local');
		      window.location="index.html";
		    }
	});
}

function myAssets(){
	window.location="user.html";
}

function changePassword(){

	var curp=document.getElementById("curp").value;
	var newp=document.getElementById("newp").value;
	var newp2=document.getElementById("newp2").value;
	var matching=newp.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/);
	if(curp==""||newp==""||newp2==""){
		bootbox.alert("All fields are mandatory");
		return false;
	}
	else if(newp!=newp2){
		bootbox.alert("Password Mismatch");
		document.getElementById("curp").value="";
		document.getElementById("newp").value="";
		document.getElementById("newp2").value="";
		return false;
	}
	else if(matching==null){
		bootbox.alert("Invalid Password!<br>Password Policy:must be at least 4 characters, no more than 12 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.");
		return false;
	}

	httpObj.onreadystatechange=function() {
		console.log(this.readyState);
		if(this.readyState=='4' && this.status=='200') {
			var result=this.responseText;
			result=JSON.parse(result);
			if(result.status==200){
				bootbox.alert("Password Changed.Please login again",function(){
					localStorage.removeItem('token');
     				localStorage.removeItem('local');
      				window.location="index.html";
				});
			}
			else if(result.message=="invalid"){
				bootbox.alert("Password change failed");
				document.getElementById("curp").value="";
				document.getElementById("newp").value="";
				document.getElementById("newp2").value="";
			}
		}
	}

	var key={'token':local,'role':role};
	console.log(key);
	key=JSON.stringify(key);
	httpObj.open('POST','http://192.168.1.236:8088/changePassword',true);
	httpObj.setRequestHeader("Authorization", key);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send('empid='+empid+'&curp='+curp+'&newp='+newp);
	
}