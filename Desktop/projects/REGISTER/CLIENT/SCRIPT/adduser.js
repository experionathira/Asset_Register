var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var key={'token':local,'role':role};
key=JSON.stringify(key);
function redirect(){
	window.location="admin.html";
}
/*---------------------IF NOT A LOGGED IN USER THEN REDIRECT TO HOMEPAGE------------------------*/
if(local==null||role==null||role=='user'){
  window.location="index.html";
}
/*-------------------ADD A NEW USER TO THE SYSTEM------------------------------------------------------------*/
function addUser(){
	var eid=document.getElementById('eid').value;
	var password=document.getElementById('password').value;
	var department = document.getElementById("department").value;
	var email = document.getElementById("email").value;
	var matching = email.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
	if(eid==""||password==""||email==""){
		bootbox.alert("All fields are mandatory");
		return false;
	}
	else if(isNaN(document.getElementById('eid').value)){
		bootbox.alert("Invalid EID");
		return false;
	}
	else if(eid.length>8){
		bootbox.alert("EID can contain maximum 8 digits");
		return false;
	}
	else if(matching==null){
		bootbox.alert("Invalid Email ID");
		return false;
	}
	var httpObj=new	XMLHttpRequest();

	httpObj.onreadystatechange=function() {
		console.log(this.readyState);
		if(this.readyState=='4' && this.status=='200') {
			var result=this.responseText;
			result=JSON.parse(result);
			if(result.status==200){
				bootbox.alert("USER ADDED SUCCESSFULLY");
				window.location="admin.html";
			}
			else{
				bootbox.alert("FAILED TO ADD USER");
			}
		}
	}

	httpObj.open('POST','http://192.168.1.236:8088/addUser',true);
	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj.setRequestHeader("Authorization", key);
	httpObj.send('eid='+eid+'&password='+password+'&department='+department+'&email='+email);
}
window.onclick = function(event) {
	var modal = document.getElementById("myModal");
  if (event.target == modal) {
   window.location = "admin.html";
  }
}