var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var key={'token':local,'role':role};
key=JSON.stringify(key);
var did,dept;
var emp;
var httpObj=new	XMLHttpRequest();

/*---------------------IF NOT A LOGGED IN USER THEN REDIRECT TO HOMEPAGE------------------------*/
if(local==null||role==null||role=='user'){
  window.location="index.html";
}

/*---------------------DISPLAY THE STATISTICS OF THE DEPARTMENT---------------------------------*/
function statistics(dept){
	localStorage.setItem('deptname',dept);
	window.location="piechart.html";
}
/*-------------------ADD A NEW USER TO THE SYSTEM------------------------------------------------------------*/
function add(){
	var eid=document.getElementById('eid').value;
	var password=document.getElementById('password').value;
	var confirm=document.getElementById('confirm').value;
	var department = document.getElementById("department").value;
	var email = document.getElementById("email").value;
	var matching = email.match(/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/);
	var matching2=password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,12}$/);
	if(eid==""||password==""||email==""){
		bootbox.alert("All fields are mandatory");
		return false;
	}
	else if(isNaN(document.getElementById('eid').value)){
		bootbox.alert("Invalid EID");
		document.getElementById('eid').value="";
		return false;
	}
	else if(eid<1||eid.length>8){
		bootbox.alert("INVALID EID");
		document.getElementById('eid').value="";
		return false;
	}
	else if(matching2==null){
		bootbox.alert("Invalid Password!<br>Password must be at least 4 characters, no more than 12 characters, and must include at least one upper case letter, one lower case letter, and one numeric digit.");
		document.getElementById('password').value="";
		document.getElementById('confirm').value="";
		return false;
	}
	else if(password!=confirm){
		bootbox.alert("Password Mismatch");
		document.getElementById('password').value="";
		document.getElementById('confirm').value="";
		return false;
	}
	else if(matching==null){
		bootbox.alert("Invalid Email ID");
		document.getElementById('email').value="";
		return false;
	}

	
var httpObj2=new XMLHttpRequest();

	httpObj2.onreadystatechange=function() {
		console.log(this.readyState);
		if(this.readyState=='4' && this.status=='200') {
			var result=this.responseText;
			result=JSON.parse(result);
			if(result.status==200){
				bootbox.alert("USER ADDED SUCCESSFULLY");
				document.getElementById('eid').value="";
				document.getElementById('department').value="";
				document.getElementById('password').value="";
				document.getElementById('confirm').value="";
				document.getElementById('email').value="";
			}
			else{
				bootbox.alert("USER HAS BEEN ALREADY ADDED");
				document.getElementById('eid').value="";
				document.getElementById('department').value="";
				document.getElementById('password').value="";
				document.getElementById('confirm').value="";
				document.getElementById('email').value="";
			}
		}
	}

	httpObj2.open('POST','http://192.168.1.236:8088/addUser',true);
	httpObj2.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj2.setRequestHeader("Authorization", key);
	httpObj2.send('eid='+eid+'&password='+password+'&department='+department+'&email='+email);
}


window.onclick = function(event) {
	var modal = document.getElementById("myModal");
  if (event.target == modal) {
   window.location = "admin.html";
  }
}
function report(){
	window.location="statistics.html";
}
function redirect(){
	window.location="admin.html";
}
		
/*---------------------IF CONFIRM IF USER WANTS TO LOGOUT FROM THE PAGE-------------------------*/
function logout(){
		
		bootbox.confirm("Do you want to logout?", function(result){ 
			if(result){
			  localStorage.removeItem('token');
      		  localStorage.removeItem('local');
		      window.location="index.html";
		    }
		});
}

/*---------------------TO ADD A NEW USER---------------------------------------------------------*/
function addUser(){
	 $(document).ready(function(){
  			 $("#myModal2").modal();
  	 });
}

/*-------------------TO VIEW CONTENT OF HR DEPARTMENT ON CHOOSING HR DEPT------------------------*/
function returnHr(){
	did="d2";
	httpObj.open('GET','http://192.168.1.236:8088/fetch/'+did,true);
	httpObj.setRequestHeader("Authorization", key);
	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj.send();
}


/*-------------------TO VIEW CONTENT OF IT DEPARTMENT ON CHOOSING IT DEPT------------------------*/
function returnIT(){
	did="d1";
	httpObj.open('GET','http://192.168.1.236:8088/fetch/'+did,true);
	httpObj.setRequestHeader("Authorization", key);
	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj.send();
}

/*-------------------TO SHOW THE DESCRIPTION OF AN ITEM IN MODAL BOX------------------------*/
function des(name,category,description,location,date,eid,price){

	document.getElementById('name').innerHTML=name;
	document.getElementById('category').innerHTML=category;
	document.getElementById('location').innerHTML=location;
	document.getElementById('date').innerHTML=date;
	document.getElementById('empid').innerHTML=eid;
	document.getElementById('price').innerHTML=price;
	document.getElementById('description').innerHTML=description;
 	//document.getElementById('content').innerHTML ="<br>Asset Name:"+name+"<br><br>Category:"+category+"<br><br>Location : "+location+"<br><br>Date Added : "+date+"<br><br>Added By: "+eid+"<br><br>Price : "+price+"<br><br><pre>Description : "+description+"</pre>";
 	$("#myModal").modal();
}

function print(){
	var doc = new jsPDF();
	doc.fromHTML($('#modalDesc').html(), 10, 10);
    doc.output("dataurlnewwindow");
}
function pdf(){
	
	var doc = new jsPDF();
	doc.fromHTML($('#modalDesc').html(), 10, 10);
    doc.save("asset.pdf");
}


httpObj.onreadystatechange=function()
{
	console.log(this.readyState);
	if(this.readyState=='4' && this.status=='200'){
		var result=this.responseText;
		result=JSON.parse(result);
		
		if(result.status==200){
			console.log("success");
		}

		content="<h2><br> <span id='deptname'> </span>ASSET DETAILS <br></h2>";
		content += "<div class='table-responsive'><table id='myTable' class='table table-hover'><thead id='thead'><tr id='thead'><th>No.</th>";
		content += "<th>Name</th><th>Category</th>";
		content += "<th>Description</th></tr></thead><tbody>";
        var i = 1;
        result.forEach(function(element) {
  
        	content += "<tr><td>" + i + "</td><td>" + element.AssetName + "</td>";
        	content += "<td>" + element.CategoryID + "</td>";
        	content +="<td><button  onclick='des(\"" + element.AssetName + "\",\"" + element.CategoryID + "\",\"" + element.Description + "\",\"" +element.Location +"\",\"" +element.Date +"\",\"" +element.EID +"\",\"" +element.Price +"\");'>Show Description</BUTTON></td></tr>";
            i++;
            did=element.DeptID;
        });
        $(document).ready(function(){
   			 $('#myTable').DataTable();
		});
		content += "</tbody> </table> </div>";
        if(did=='d1'){
        	document.getElementById('section1').innerHTML=content;
            document.getElementById('deptname').innerHTML="IT ";
		}
        if(did=='d2'){
        	document.getElementById('section1').innerHTML=content;
         	document.getElementById('deptname').innerHTML="HR ";
        }
	}
}


