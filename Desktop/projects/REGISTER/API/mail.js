var nodemailer=require('nodemailer');

module.exports.sendMail=function(toAddress,token2,text) {

	return new Promise(function(resolve,reject){
	console.log("mail sent");
	var to=toAddress;
	var transporter = nodemailer.createTransport({
			service: 'Gmail',
			auth: {
					user: 'assetregisterexp@gmail.com',
					pass: 'assetregister' 
				 }
	});
	

	var mailOptions = {
			 from: 'assetregisterexp@gmail.com', 
			 to: to, 
			 subject: 'New Password', 
			 text: text 
	};

    transporter.sendMail(mailOptions, function(error, info){
	if(!error){
		 console.log(info);
		 resolve();
	}
	else{
		 reject();
	}
    });
 });
}