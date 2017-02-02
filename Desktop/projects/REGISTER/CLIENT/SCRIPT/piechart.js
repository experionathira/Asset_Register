var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var dep=localStorage.getItem('deptname');
var key={'token':local,'role':role};
key=JSON.stringify(key);
var test;
function back(){
	window.location="admin.html";
}
/*---------------------IF NOT A LOGGED IN USER THEN REDIRECT TO HOMEPAGE------------------------*/
if(local==null||role==null||role=='user'){
  window.location="index.html";
}
/*---------------------IF CONFIRM IF USER WANTS TO LOGOUT FROM THE PAGE-------------------------*/
function Logout(){
		
		bootbox.confirm("Do you want to logout?", function(result){ 
			if(result){
			  localStorage.removeItem('token');
      		  localStorage.removeItem('local');
		      window.location="index.html";
		    }
		});
}
var httpObj=new	XMLHttpRequest();
httpObj.onreadystatechange=function() {
	console.log(this.readyState);
	if(this.readyState=='4' && this.status=='200') {
		
		var result=this.responseText;
		result=JSON.parse(result);
		console.log(result);
		
		result.json.forEach(function(ele){

				test="<table><tr><th>Name</th><th>Price</th><th>Location</th></tr>";
				result.details.forEach(function(element){
					test += "<tr>"
					if(element.CategoryID == ele.CategoryID){
						test+=`<td>${element.AssetName}</td><td>${element.Price}</td><td>${element.Location}</td>`;
					}
					test+="</tr>";
				});
				test+="</table>";
				ele.details = test;
		});
									
		console.log(result);		
		var dataY =[];
		result.json.forEach(function(element){
				
				dataY.push({y:element.count , indexLabel:element.CategoryID, test : element.details });

		});

		console.log(dataY);		
		var chart = new CanvasJS.Chart("chartContainer",
			{
				theme: "theme2",
				title:{
					text: "DEPARTMENT ASSETS"
				},
				data: [
				{
					type: "pie",
					toolTipContent: "Count:{y} {test}",
					legendText: "{indexLabel}",
					dataPoints: dataY,
					showInLegend: true
				}
				]
			});
		chart.render();

		
	}

}

httpObj.open('GET','http://192.168.1.236:8088/statistics/'+dep,true);
httpObj.setRequestHeader("Authorization", key);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send();
