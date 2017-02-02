var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var deptid=localStorage.getItem('deptid');
var empid=localStorage.getItem('eid');
var count=0;

function myDept(){
	
	var httpObj=new	XMLHttpRequest();
	httpObj.onreadystatechange=function()
	{
		console.log(this.readyState);
		if(this.readyState=='4' && this.status=='200'){
			var result=this.responseText;
			result=JSON.parse(result);

			if(result.status==200){
				console.log("success");
			}
			content = "<div class='table-responsive'><table id='myTable' class='table table-hover'><thead><tr><th id='hide'>No.</th>";
			content += "<th id='hide'>ID</th><th>Name</th><th>Category</th><th id='hide'>Date</th><th id='hide'>EID</th><th id='hide'>Price</th>";
			content += "<th id='hide'>Location</th><th>Description</th></tr></thead><tbody>";
	        var i = 1;
	        result.forEach(function(element) {
	  
	        	content += "<tr><td id='hide'>" + i + "</td><td id='hide'>" + element.AssetID + "</td><td>" + element.AssetName + "</td>";
	        	content += "<td>" + element.CategoryID + "</td><td id='hide'>" + element.Date + "</td><td id='hide'>" + element.EID + "</td>";
	        	content += "<td id='hide'>" + element.Price + "</td><td id='hide'>" + element.Location + "</td>";
	        	content +="<td><button id='show' onclick='desc(\"" + element.AssetName + "\",\"" + element.CategoryID + "\",\"" + element.Description + "\",\"" +element.Location +"\",\"" +element.Date +"\",\"" +element.EID +"\",\"" +element.Price +"\");'>Show Description</BUTTON></td></tr>";
	            i++;
	            did=element.DeptID;
	        });
	        
			content += "</tbody> </table> </div>";
	        document.getElementById('container').innerHTML = content;
	    	 $(document).ready(function(){
	         	$('#myTable').DataTable();
	   		 });
		}
	}
	httpObj.open('GET','http://192.168.1.236:8088/fetch/'+deptid,true);
	httpObj.setRequestHeader("Authorization", key);
	httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
	httpObj.send();
}


