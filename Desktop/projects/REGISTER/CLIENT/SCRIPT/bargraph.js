var local=localStorage.getItem('token');
var role=localStorage.getItem('role');
var key={'token':local,'role':role};
key=JSON.stringify(key);

var httpObj=new  XMLHttpRequest();
httpObj.onreadystatechange=function() {
  console.log(this.readyState);
  if(this.readyState=='4' && this.status=='200') {
    
    var result=this.responseText;
    result=JSON.parse(result);    
    var dataY =[];
    result.forEach(function(element){
          dataY.push({y:element.count , label:element.CategoryID });
    });
    console.log(dataY);
    var chart = new CanvasJS.Chart("bargraph",
    {
      title:{
        text: "COMPANY ASSETS"    
      },
      animationEnabled: true,
      axisY: {
        title: "C0UNT"
      },
      legend: {
        verticalAlign: "bottom",
        horizontalAlign: "center"
      },
      theme: "theme2",
      data: [

      {        
        type: "column",  
        showInLegend: true, 
        legendMarkerColor: "grey",
        legendText: "Item Count",
        indexLabel: "{y}",
        dataPoints: dataY
       
      }   
      ]
    });

    chart.render();
  }
}
  
httpObj.open('GET','http://192.168.1.236:8088/statistics/all/',true);
httpObj.setRequestHeader("Authorization", key);
httpObj.setRequestHeader('content-type','application/x-www-form-urlencoded');
httpObj.send();