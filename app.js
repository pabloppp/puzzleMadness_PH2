

window.addEventListener("load", function(){ //SE EJECUTA DESPUES DE CARGAR TODO

	var tabcontainer = document.getElementById("tabcontainer");
	var lastslide;
	var currenttab = -1;
	var firstTab = 0;
	var tabsslides = [];
	var imgurl;

	var canvas = document.getElementById("puzzle");

	for(var i in tabcontainer.children){
		var elem = tabcontainer.children[i];
		if(elem.nodeType == Node.ELEMENT_NODE){
			tabsslides.push(elem);	
		}
	}

	console.log(tabs);

	imgpreview = document.getElementById("loadedimg");
	imgpreview.ondragover = function () {return false; ev.preventDefault(); };
	imgpreview.ondragend = function () {return false; };
	imgpreview.ondrop = function (e) {
		e.preventDefault();
		imageloaded(e.dataTransfer);
	}

	notifyme = function(){
		contador++;
		functions().toast("HELP me", 5000);
	}	

	setTab = function(number){
		if(number == currenttab) return;
		var tabholder = document.getElementById("tabs");
		tabs = tabholder.children;
		if(tabs.length > number){
			for(var i in tabs){
				if(tabs[i].nodeType == Node.ELEMENT_NODE){
					if(i < number) tabs[i].classList.add("left");
					else tabs[i].classList.add("right");		
				}

			}
			tabs[number].classList.remove("left", "right");
			

			var firstprefix = "left";
			var secondprefix = "right";	
			if(currenttab > number){
				secondprefix = "left";
				firstprefix = "right";
				console.log("bang");
			}

			if(lastslide){
				//tabcontainer.removeChild(lasttab);
				var ls = lastslide
				ls.classList.add("leaving",firstprefix);
				setTimeout(function(){
					//ls.classList.remove("leaving",firstprefix);	
					//tabcontainer.removeChild(ls);
				},300);
			}
			else{
				//tabcontainer.innerHTML = "";	
				for(var i in tabsslides){
					if(i < number) tabsslides[i].classList.add("leaving", "left");
					else if(i > number) tabsslides[i].classList.add("leaving", "right");
				}
			}

			currenttab = number;
			
			if(lastslide){
				tabsslides[currenttab].classList.add(secondprefix);
				setTimeout(function(){
					tabsslides[currenttab].classList.remove(secondprefix);
				},1);
			}
			lastslide = tabsslides[currenttab];
			lastslide.classList.remove("leaving");
			//tabcontainer.appendChild(lastslide);
		}
	}

	setTab(firstTab);


	loadimage = function(){
		var inputfile = document.getElementById("openimage");
		inputfile.click();
	}

	imageloaded = function(img){
		document.getElementById("openbutton").disabled = true;
		var inputfile = img || document.getElementById("openimage");
		var imagefile = inputfile.files[0];	
		var reader = new FileReader();
		reader.readAsDataURL(imagefile);
		reader.onload = function(event){
			imgurl = event.target.result;
			document.getElementById("loadedimg").src = imgurl;
			document.getElementById("openbutton").innerHTML = "CAMBIAR";
			document.getElementById("instrucciones").innerHTML = "Ahora selecciona la pestaña 'PUZZLE' y... ¡A jugar!";
			document.getElementById("openbutton").disabled = false;
			functions().toast("Imagen cargada con exito", 5000);

			populatePieces();

		};
	}

	populatePieces = function(){
		var container = document.getElementById("piecehub");
		container.innerHTML = "";		
		for(var i = 0; i<6*8;i++){
			var left = i%6;
			var top = i/6;
			var piece = document.createElement("IMG");
			piece.style.backgroundImage = "url("+imgurl+")";
			piece.style.backgroundPosition = "-"+(left*60)+"px -"+(top*60)+"px";
			container.appendChild(piece);
		}
	}

	showhub = function(){
		var hub = document.getElementById("piecehub");
		var button = document.getElementById("buttonup");
		button.classList.toggle("active");
		hub.classList.toggle("active");
	}

	window.addEventListener("resize", function(){
		canvasresize();
	});

	canvasresize = function(){

		var scale = (window.innerWidth-20)/480;
		if(scale > 1) scale = 1;

		canvas.style.webkitTransform = "scale("+scale+", "+scale+")";
		canvas.style.left = (-240*(1-scale))+"px";
		canvas.style.marginTop = (-190*(1-scale))+"px";
		canvas.style.marginBottom = (-190*(1-scale))+"px";
	};
	canvasresize();

	updateCanvas = function(){
		var ctx = canvas.getContext("2d");
		for(var y=0;y<6;y++){
			for(var x=0;x<8;x++){
				ctx.fillStyle="#fff";
				
				//if( Math.pow(-1, x+y) == -1 ) ctx.fillStyle="#ccc";
				//else ctx.fillStyle="#eee";

				//ctx.fillRect(x*60,y*60,60,60);

				ctx.strokeStyle = '#ddd';

				line(x*60, y*60, x*60, y*60+10);
				line(x*60, y*60, x*60+10, y*60);

				line(x*60+60, y*60, x*60+50, y*60);
				line(x*60+60, y*60, x*60+60, y*60+10);

				line(x*60, y*60+60, x*60+10, y*60+60);
				line(x*60, y*60+60, x*60, y*60+50);

				line(x*60+60, y*60+60, x*60+50, y*60+60);
				line(x*60+60, y*60+60, x*60+60, y*60+50);
			}
		}
		
	}
	

	line = function(xi, yi, xf, yf){
		var ctx = canvas.getContext("2d");
		ctx.beginPath();
		ctx.moveTo(xi,yi);
		ctx.lineTo(xf,yf);
		ctx.stroke();
	}

	updateCanvas();

	setTimeout(function(){
		document.getElementById("splash").classList.add("fade");
	}, 500);

});