document.getElementById("Login").addEventListener("click", function(){
	//console.log("clicked")
	
	let name=document.getElementById("Username").value
	let Password= document.getElementById("Password").value
	
	var xhttp= new XMLHttpRequest()
	xhttp.open("POST", "/Login", true)
	xhttp.setRequestHeader("Content-Type", "application/json")
	xhttp.send(JSON.stringify({name:name, Password:Password}))


})
