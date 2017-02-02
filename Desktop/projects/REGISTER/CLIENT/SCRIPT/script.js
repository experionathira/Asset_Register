function validate(){

	var httpObj=new	XMLHttpRequest();
	/*---------------------TO CHECK IF EID IS NOT EMPTY------------------------*/
	if(document.getElementById('eid').value==""){
			bootbox.alert("EID cannot be left empty!");
				document.getElementById('eid').value="";
				document.getElementById('password').value="";
				return false;
	}

	/*---------------------TO CHECK IF PASSWORD IS NOT EMPTY------------------------*/
	else if(document.getElementById('password').value==""){
			bootbox.alert("Password cannot be left empty!");
				document.getElementById('password').value="";
				return false;
	}

	/*---------------------TO CHECK IF EID IS A NUMERIC VALUE------------------------*/
	else if(isNaN(document.getElementById('eid').value)||document.getElementById('eid').value<0)
	{

			bootbox.alert("Invalid EID");
				document.getElementById('eid').value="";
				document.getElementById('password').value="";
			return false;
	}

	httpObj.onreadystatechange=function()
	{
		console.log(this.readyState);
		if(this.readyState=='4' && this.status=='200'){
		
			var result=this.responseText;
			result=JSON.parse(result);
			if(result.status==200){
				
			 	var token=result.token;
			 	localStorage.setItem('token',result.token);
				localStorage.setItem('role',result.usertype);
				localStorage.setItem('deptid',result.deptid);
				localStorage.setItem('eid',result.eid);
				if(result.usertype=="admin"){
					window.location="admin.html";
				}
				else{
					window.location="user.html";
				}
			}
			else{
				bootbox.alert("Invalid Login Credentials");
				document.getElementById('eid').value="";
				document.getElementById('password').value="";
				
			}
		}
	}
	var password=document.getElementById('password').value;
	password=(Crypto.MD5(password)).toString();
	httpObj.open('POST','http://192.168.1.236:8088',true);
	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj.send('eid='+document.getElementById('eid').value+'&password='+password);
}

$(function() {
    if (localStorage.chkbx && localStorage.chkbx != '') {
        $('#remember_me').attr('checked', 'checked');
        $('#eid').val(localStorage.usrname);
        $('#password').val(localStorage.pass);
    } else {
        $('#remember_me').removeAttr('checked');
        $('#eid').val('');
        $('#password').val('');
    }
    $('#remember_me').click(function() {
         if ($('#remember_me').is(':checked')) {
            localStorage.usrname = $('#eid').val();
            localStorage.pass = $('#password').val();
            localStorage.chkbx = $('#remember_me').val();
        } else {
            localStorage.usrname = '';
            localStorage.pass = '';
            localStorage.chkbx = '';
        }
    });
});
$('#forgotpass').click(function(){
     bootbox.confirm({
       size: "small",
       message: "Recieve a new password by mail?",
       callback: function(result) {
            if (result == true) {
             bootbox.prompt({ 
              size: "small",
              title: "Enter Employee ID", 
              callback: function(result){
                  if(result==null){
                     window.location.reload();
                  }
                  var id=result;
                  if(id=="") bootbox.alert("Enter EID");
              
                  else {
          
                     var httpObj1=new XMLHttpRequest();
                     httpObj1.onreadystatechange=function(){
                         if(this.readyState=='4' && this.status=='200'){
                         	
							var result=this.responseText;
							result=JSON.parse(result);
							if(result.status==200){
								bootbox.alert(result.message);
							}
							else{
								bootbox.alert(result.message);
							}

                        }
                    };
                 httpObj1.open('POST','http://192.168.1.236:8088/forgotPassword',true);
                 httpObj1.setRequestHeader('content-type','application/x-www-form-urlencoded');
                 httpObj1.send('userid='+id);
                  }

              }
             });
             
            }
            else {
                window.location.reload();
            }
        }
    });
});

