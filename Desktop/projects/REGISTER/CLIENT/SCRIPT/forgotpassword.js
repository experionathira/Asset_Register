function forgotPassword(){

	var httpObj=new	XMLHttpRequest();
	var password=document.getElementById('newp').value;
	var confirm=document.getElementById('newp2').value;
	var matching2=password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/);
	if(password==""||confirm==""){
		bootbox.alert("All fields are mandatory");
		return false;
	}
	else if(matching2==null){
		bootbox.alert("Invalid Password!<br>Password must be at least 4 characters, no more than 12 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.");
		document.getElementById('newp').value="";
		document.getElementById('newp2').value="";
		return false;
	}
	else if(password!=confirm){
		bootbox.alert("Password Mismatch");
		document.getElementById('newp').value="";
		document.getElementById('newp2').value="";
		return false;
	}
	else{
		httpObj.onreadystatechange=function()
		{
			console.log(this.readyState);
			if(this.readyState=='4' && this.status=='200'){
			
				var result=this.responseText;
				result=JSON.parse(result);
				if(result.status==200){
					bootbox.alert("Password Changed Successfully",function(){
						location.reload();
					});
				}
				else{
					bootbox.alert("Failed to change password.Please try again!",function(){
						location.reload();
					});
				}
			}
		}
		var tokens = location.search.split('?');
		var token=tokens[1];
		httpObj.open('POST','http://192.168.1.236:8088/forgot',true);
		httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
		httpObj.send('token='+token+'&password='+password);
	}
}
