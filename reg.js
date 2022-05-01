document.getElementById("Register").addEventListener("click", function(){
	console.log("clicked")
	let name=document.getElementById("username").value
	let Password= document.getElementById("Pass").value
	let privacy= document.getElementById("private").checked
	console.log(privacy)
	
	var xhttp= new XMLHttpRequest();
	
	xhttp.open("POST", "/registration", true)
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(JSON.stringify({name:name, Password:Password, privacy:privacy}))


})