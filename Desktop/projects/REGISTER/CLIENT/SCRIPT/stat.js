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
function generateStatistics() {

    var start = document.getElementById("start").value;
    var end = document.getElementById("end").value;
    var d = new Date(start.split("-").reverse().join("-"));
    var dd = d.getDate();
    var mm = d.getMonth() + 1;
    var yy = d.getFullYear();
    var dstart = yy + "-" + mm + "-" + dd;
    d = new Date(end.split("-").reverse().join("-"));
    dd = d.getDate();
    mm = d.getMonth() + 1;
    yy = d.getFullYear();
    var dend = yy + "-" + mm + "-" + dd;


    var httpObj=new XMLHttpRequest();

    httpObj.onreadystatechange=function() {
        console.log(this.readyState);
        if(this.readyState=='4' && this.status=='200') {
            var result=this.responseText;
            result=JSON.parse(result);
            console.log(result);
           var content;
        
        content = "<div class='table-responsive' id='stat'><table id='myTable' class='table table-hover'><thead><tr id=thead><th>No.</th>";
        content += "<th>Name</th><th>Category</th>";
        content += "<th id='hide'>Date</th><th>Price</th><th id='hide'>Location</th></tr></thead><tbody>";
        var i = 1;
        result.forEach(function(element) {
  
            content += "<tr><td>" + i + "</td><td>" + element.AssetName + "</td>";
            content += "<td>" + element.CategoryID + "</td>";
            content +="<td id='hide'>" + element.Date + "</td><td>" + element.Price + "</td><td id='hide'>" + element.Location + "</td></tr>";
            i++;
            did=element.DeptID;
        });
         content += "</tbody> </table> </div>";
        }
        document.getElementById('statistics').innerHTML=content;
    }

httpObj.open('POST','http://192.168.1.236:8088/assetStatistics',true);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send('startdate='+dstart+'&enddate='+dend);
}