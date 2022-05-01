document.getElementById("Save").addEventListener("click", function(){
	let yes= document.getElementById("yes").checked
	let no= document.getElementById("no").checked
	console.log(yes)
	console.log(no)
	if (yes && !no)
	{
		let answer="Yes"
		var xhttp= new XMLHttpRequest()
		xhttp.open("POST", "/save", true)
		xhttp.setRequestHeader("Content-Type", "application/json")
		xhttp.send(JSON.stringify({answer:answer}))
	}
	else if (!yes && no)
	{
		let answer="No"
		var xhttp= new XMLHttpRequest()
		xhttp.open("POST", "/save", true)
		xhttp.setRequestHeader("Content-Type", "application/json")
		xhttp.send(JSON.stringify({answer:answer}))
	}
	else
	{
			alert("you have entered the an invalid response")
		
	}

})