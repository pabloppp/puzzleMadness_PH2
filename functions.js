
//FUNCTIONS
var toasting;
var lasttoastime = new Date().getTime();
var lasttoastdelay = 0;

var functions = function(){
	fns = {};

	fns.toast = function(message, length, noclose){
		var body = document.body;
		var time = length || 3000;
		if(time < 300) time = 300;
		var container = document.getElementById("toaster");
		if(!container){
			container = document.createElement("DIV");
			container.id = "toaster";
			container.classList.add("toaster");
			body.appendChild(container);
		}

		// 0000->2000     1000

		var delaytime =  350 + lasttoastime + lasttoastdelay - (new Date().getTime());
		if(delaytime < 0) delaytime = 0;
		lasttoastime = (new Date().getTime()) + delaytime;
		lasttoastdelay = time;

		console.log("delay: "+delaytime);
		console.log("time: "+lasttoastime);

		setTimeout(function(){ 
			if(!toasting){
				toasting = true;
				var toast = document.createElement("DIV");
				toast.classList.add("toast");
				toast.innerHTML = message
				if(!noclose) toast.innerHTML +=" <i class='close fa fa-close' onclick='functions().toastdismiss()'></i>";

				container.appendChild(toast);

				setTimeout(function(){ 
					toast.classList.add("show");
				}, 100);

				setTimeout(function(){ 
					toast.classList.remove("show");
					setTimeout(function(){
						if(container.childNodes.length > 0) container.removeChild(toast);	
						toasting = false;
					}, 300);
				}, time);
			}
		}, delaytime);
	}

	fns.toastdismiss = function(){
		var body = document.body;
		var container = document.getElementById("toaster");	
		if(container.childNodes.length > 0){
			var toast = container.childNodes[0];
			toast.classList.remove("show");
			setTimeout(function(){
				if(container.childNodes.length > 0) container.removeChild(toast);	
				toasting = false;
				lasttoastdelay = 0;
			}, 300);
		}
	}

	return fns;
}

