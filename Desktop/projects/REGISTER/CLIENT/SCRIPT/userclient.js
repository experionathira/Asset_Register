var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var deptid=localStorage.getItem('deptid');
var empid=localStorage.getItem('eid');
var count=0;
var httpObj=new	XMLHttpRequest();

/*---------------------IF NOT A LOGGED IN USER THEN REDIRECT TO HOMEPAGE------------------------*/
if(local==null||role==null||role=='admin'){
  window.location="index.html";
}

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
  window.location="changePassword.html";
}
/*---------------------TO ADD A NEW ROW IN THE TABLE FOR INSERTION------------------------------*/
function addRow () {
             count++;
            if(count>1){
              bootbox.alert("You can add only one asset at a time!");
              return false;
            }
            var table = document.getElementById('myTable');
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.style.backgroundColor="#e0e0d1";
            var cell1 = row.insertCell(0);
            var element1 = document.createElement("input");
            element1.type = "text";
            element1.name="txtbox[]";
            element1.id="value1";
            element1.style.display="none";
            cell1.appendChild(element1);

            var cell2 = row.insertCell(1);
            var element2 = document.createElement("input");
            element2.type = "text";
            element2.name="txtbox[]";
            element2.id="value2";
            element2.style.width="50px";
            element2.style.border="none";
            element2.style.display="none";
            cell2.appendChild(element2);

            var cell3 = row.insertCell(2);
            var element3 = document.createElement("input");
            element3.type = "text";
            element3.id="value3";
            element3.name = "txtbox[]";
            element3.style.width="100px";
            element3.style.border="none";
            cell3.appendChild(element3);
          
            var cell4 = row.insertCell(3);
            var element4 = document.createElement("select");
            if(deptid=='d1'){
            element4.innerHTML="<option>SELECT</option><option>CPU</option><option>KEYBOARD</option><option>LAPTOP</option><option>MONITOR</option><option>OTHER</option>";
            }
            else{
            element4.innerHTML="<option>SELECT</option><option>TABLE</option><option>CHAIR</option><option>STATIONARY</option>";
            }
            element4.id="value4";
            cell4.appendChild(element4);

            var cell5 = row.insertCell(4);
            var element5 = document.createElement("input");
            element5.type = "text";
            element5.name = "txtbox[]";
            element5.style.border="none";
          
            element5.id="value5";
            element5.style.width="50px";
            element5.style.display="none";
            cell5.appendChild(element5);

            var cell6 = row.insertCell(5);
            var element6 = document.createElement("input");
            element6.type = "text";
            element6.name = "txtbox[]";
            element6.id="value6";
            element6.style.width="50px";
            element6.style.display="none";
            element6.style.border="none";
            cell6.appendChild(element6);


            var cell8 = row.insertCell(6);
            var element8 = document.createElement("input");
            element8.type = "text";
            element8.name = "txtbox[]";
            element8.id="value8";
            // element4.setAttribute("class","form-control ");
            element8.style.width="50px";
            element8.style.border="none";
            cell8.appendChild(element8);

            var cell9 = row.insertCell(7);
            var element9 = document.createElement("select");
            element9.type = "text";
            element9.name = "txtbox[]";
            element9.id="value9";
            // element9.setAttribute("class","form-control ");
            element9.innerHTML="<option>SELECT</option><option>KOCHI</option><option>TRIVANDRUM</option>";
            cell9.appendChild(element9);

            var cell10 = row.insertCell(8);
            var element10 = document.createElement("textarea");
            element10.type = "text";
            element10.name = "txtbox[]";
            element10.id="value10";
            element10.maxLength = "5000";
          
            element10.style.border="none";
            cell10.appendChild(element10);

            var cell11 = row.insertCell(9);
            var element11 = document.createElement("input");
            element11.type = "button";
            element11.value="Save"
            element11.name = "txtbox[]";
            element11.id="value11";
            element11.id="save";
            cell11.appendChild(element11);
            element11.onclick = function() { saveRow() };
    
}
/*---------------------INSERTING THE VALUES INTO DATABASE------------------------------*/
function saveRow(){
	
  var row=document.getElementById("value1").value;
  var name=document.getElementById("value3").value;
  var cat=document.getElementById("value4").value;
  var eid=empid;
  var price=document.getElementById("value8").value;
  var location=document.getElementById("value9").value;
  var description=document.getElementById("value10").value;
  description = description.replace(/\r?\n/g, '<br />');
  var amount=/^(?:\d*\.\d{1,2}|\d+)$/;
  

  /*-------TO CHECK IF ALL THE FIELDS ARE FILLED BY THE USER-------------------------*/
  if(name==""||cat=="SELECT"||price==""||location=="SELECT")
  {
    bootbox.alert("All fields are mandatory");
    return false;
  }
  /*------TO CHECK IF PRICE ENTERED BY THE USER IS A NUMERIC VALUE-------------------*/
  else if(price<0||isNaN(price)||price.length>10||price.search(amount)==-1)
  {
    bootbox.alert("Invalid Price<br>Price Format:Maximum Length:10,Decimal Points:2");
    return false;
  }
  var date = new Date();
  var year=date.getFullYear();
  var mm=date.getMonth()+1;
  var day=date.getDate();
  var today=year+"-"+mm+"-"+day;
  try{
    httpObj.open('POST','http://192.168.1.236:8088/insert',true);
    httpObj.setRequestHeader("Authorization", key);
    httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
    httpObj.send('row='+row+'&name='+name+'&cat='+cat+'&date='+today+'&eid='+eid+'&price='+price+'&location='+location+'&description='+description+'&deptid='+deptid);
    count--;
  }
	catch(e){
            alert(e);
  }

}

/*-------TO SHOW THE DESCRIPTION OF AN ASSET IN MODAL BOX-------------------------*/
function des(id){

    document.getElementById("modalDesc").innerHTML ="<pre>"+id+"</pre>";
    $("#myModal").modal();
}

function desc(name,category,description,location,date,eid,price){
  document.getElementById('modalDesc').innerHTML ="<br>Asset Name:"+name+"<br><br>Category:"+category+"<br><br>Location : "+location+"<br><br>Date Added : "+date+"<br><br>Added By: "+eid+"<br><br>Price : "+price+"<br><br><pre>Description : "+description+"</pre>";
  $("#myModal").modal();
}
   

/*-------TO DELETE AN ENTRY FROM THE TABLE------------------------------------------*/
function deleteRow(id,eid) {
    
   
      bootbox.confirm("Do you want to delete the asset?", function(result){ 
      if(result){

        httpObj.open('DELETE','http://192.168.1.236:8088/',true);
        httpObj.setRequestHeader("Authorization", key);
        httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
        httpObj.send('id='+id);
      
    }
   });
}
httpObj.onreadystatechange=function()
{
	console.log(this.readyState);
  if(this.readyState=='4' && this.status=='200')
	{
		var result=this.responseText;
		result=JSON.parse(result);
		console.log(result);
    if(result.message=="added"){
         bootbox.alert("New Asset Added",function(){
         window.location="user.html";
         });
         

    }
    else if(result.message=="deleted"){
         bootbox.alert("Asset Deleted",function(){
         window.location="user.html";
       });
    }
    content = "<div class='table-responsive'><button id='add' onclick='location.reload();'><span class='fa fa-times'></span></button><button id='add' onclick='addRow()'>ADD ASSET</button><table id='myTable' class='table table-hover'><thead><tr><th>No.</th>";
    content += "<th>ID</th><th>Name</th><th>Category</th><th>Date</th><th>EID</th><th>Price</th><th>Location</th>";
    content += "<th>Description</th><th></th></tr></thead><tbody>";
    var i = 1;
    result.forEach(function(element) {
        console.log(element.Description);
        content += "<tr><td>" + i + "</td><td>" + element.AssetID + "</td><td>" + element.AssetName + "</td>";
        content += "<td>" + element.CategoryID + "</td><td>" + element.Date + "</td><td>" + element.EID + "</td>";
        content += "<td>" + element.Price + "</td><td>" + element.Location + "</td>";
        content += "<td><button id='show' onclick='des(\"" + element.Description +"\");'>Show Description</BUTTON></td>";
        content += "<td><button onclick='deleteRow( "+ element.AssetID +","+element.EID+");'><span class='fa fa-trash'></span></button></td></tr>";
        i++;
    });
    content += "</tbody> </table> </div>";
    document.getElementById('container').innerHTML = content;
     $(document).ready(function(){
         $('#myTable').DataTable();
    });

  }
}
console.log(local,role);
var key={'token':local,'role':role};
console.log(key);
key=JSON.stringify(key);
httpObj.open('GET','http://192.168.1.236:8088/assets/'+deptid+'/'+empid,true);
httpObj.setRequestHeader("Authorization", key);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send();
