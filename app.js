

window.addEventListener("load", function(){ //SE EJECUTA DESPUES DE CARGAR TODO

	var tabcontainer = document.getElementById("tabcontainer");
	var lastslide;
	var currenttab = -1;
	var firstTab = 0;
	var tabsslides = [];
	var imgurl;
	var selectedPiece;
	var imgPieces = [];
	var loadedImg;
	var originalData, puzzleData;
	var puzzle = [];
	var movements = 0;
	var changeCell;

	//WEB WORKER SETUP
	if(typeof(Worker) !== "undefined") {
		if(typeof(w) == "undefined") {
		    w = new Worker("validatorWorker.js");
		}
	}
	else{
		console.log("WEB WORKERS  NOT SUPPORTED");
	}

	resetPuzzle = function(){
		selectedPiece = undefined;
		imgPieces = [];
		changeCell = undefined;
		movements = 0;
		document.getElementById("counter").innerHTML = movements;
		puzzle = [];
		for(var i=0;i<6;i++){

			puzzleRow = [];
			for(var j=0;j<8;j++){
				puzzleRow.push(undefined);
			}
			puzzle.push(puzzleRow);

		}
	}
	resetPuzzle();

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

		if(number > 0 && !loadedImg){
			functions().toast("Carga una imagen antes de jugar...", 2000);
			return;
		}
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

		toggleLoading();
		

		document.getElementById("openbutton").disabled = true;
		var inputfile = img || document.getElementById("openimage");
		var imagefile = inputfile.files[0];	
		var reader = new FileReader();

		if(!imagefile.type.match(/image.*/)){
			functions().toast("Debes seleccionar una imagen", 5000);
			toggleLoading();
			return;
		}
        else reader.readAsDataURL(imagefile);
		reader.onload = function(event){

			imgurl = event.target.result;

			var image = new Image();
			image.onload = function(){
				var canvas = document.getElementById("hiddenCanvas");
				image.height = 360;
				image.width = 480;
				var ctx = canvas.getContext("2d");
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				canvas.width = image.width;
				canvas.height = image.height;
				ctx.drawImage(image, 0, 0, image.width, image.height);

				originalData = ctx.getImageData(0, 0, 480, 360);

				document.getElementById("loadedimg").src = canvas.toDataURL();
				imgurl = canvas.toDataURL(); 

				document.getElementById("openbutton").innerHTML = "CAMBIAR";
				document.getElementById("instrucciones").innerHTML = "<button onclick=\"setTab(1)\" >¡JUGAR!</button>";
				document.getElementById("openbutton").disabled = false;
				functions().toast("Imagen cargada con exito", 2000);

				loadedImg = new Image();
				loadedImg.src = canvas.toDataURL();

				populatePieces();

				toggleLoading();

			}
			image.src = imgurl;

			/*imgurl = event.target.result;
			document.getElementById("loadedimg").src = imgurl;
			document.getElementById("openbutton").innerHTML = "CAMBIAR";
			document.getElementById("instrucciones").innerHTML = "Ahora selecciona la pestaña 'PUZZLE' y... ¡A jugar!";
			document.getElementById("openbutton").disabled = false;
			functions().toast("Imagen cargada con exito", 5000);

			populatePieces();*/

		};
	}

	populatePieces = function(){
		resetPuzzle();
		updateCanvas();
		showhub();

		var container = document.getElementById("piecehub");
		container.innerHTML = "";		
		for(var i = 0; i<6;i++){ //Y

			for(var j=0;j<8;j++){ //X
				var left = j;
				var top = i;
				var piece = document.createElement("DIV");
				piece.setAttribute("draggable", "true");
				piece.setAttribute("ondragstart", "pieceStart(event)");
				piece.setAttribute("ondragend", "dragEnded()");
				piece.style.backgroundImage = "url("+imgurl+")";
				piece.style.backgroundPosition = "-"+(left*60)+"px -"+(top*60)+"px";
				piece.puzzleData = {x:left, y:top};
				piece.addEventListener("click", function(event){
					console.log(event);
					if(selectedPiece == event.target){
						event.target.classList.remove("selected");	
						selectedPiece = undefined;
					}
					else{
						if(selectedPiece) selectedPiece.classList.remove("selected");	
						event.target.classList.add("selected");
						selectedPiece = event.target;
						showhub();
					}
					changeCell = undefined;
					updateCanvas();
				});
				imgPieces.push(piece);
				//
			}
			
		}

		imgPieces.sort(function(){return Math.random() - 0.5})

		for(var i=0;i<imgPieces.length;i++){
			container.appendChild(imgPieces[i]);
		}
		
	}

	showhub = function(){
		var hub = document.getElementById("piecehub");
		var button = document.getElementById("buttonup");
		button.classList.toggle("active");
		hub.classList.toggle("active");
	}

	pieceStart = function(event){
		//event.preventDefault();

		/*var img = document.createElement("img");
    	img.src = "http://jerusalemconnection.com/Portals/0/Images/puzzle%20piece%20.png";
    	event.dataTransfer.setDragImage(img, 0, 0);*/
		selectedPiece = event.target;
		changeCell = undefined;
		showhub();
	}

	dragEnded = function(event){
		showhub();
		selectedPiece = undefined;
	}

	canvas.ondragover = function () {return false; ev.preventDefault(); };
	canvas.ondragend = function () {return false; };
	canvas.ondrop = function (e) {
		e.preventDefault();
		addPieza(e, true);	
	}

	addPieza = function(event, noreshow){
		if(!loadedImg){
			functions().toast("Debes cargar una imagen...", 3000);
			return;	
		}
		
		var ctx = canvas.getContext("2d");	
		var mouse = getMousePos(canvas, event);

		var posX = Math.floor(mouse.x / 60);
		var posY = Math.floor(mouse.y / 60);

		if(!selectedPiece){

			if(changeCell){

				var tempPiece = puzzle[posY][posX];
				puzzle[posY][posX] = puzzle[changeCell.y][changeCell.x];
				puzzle[changeCell.y][changeCell.x] = tempPiece;

				if(changeCell.x !== posX || changeCell.y !== posY){
					movements++;
					document.getElementById("counter").innerHTML = movements;
				}

				changeCell = undefined;

				updateCanvas();

				return;
			}

			changeCell = {x:posX, y:posY}
			updateCanvas();
			//functions().toast("No has seleccionado ninguna pieza...", 3000);
			return;
		}


		if( puzzle[posY][posX] ){
			functions().toast("Ese hueco ya está ocupado", 2000);
			if(selectedPiece) selectedPiece.classList.remove("selected");	
			selectedPiece = undefined;
			updateCanvas();	
			if(!noreshow) showhub();
			return;
		}

		puzzle[posY][posX] = selectedPiece;
		selectedPiece.parentNode.removeChild(selectedPiece);
		selectedPiece = undefined;
		updateCanvas();
		movements++;
		document.getElementById("counter").innerHTML = movements;
		if(!noreshow) showhub();
	}

	getMousePos = function(canvas, evt){
		var rect = canvas.getBoundingClientRect();

		var scale = (window.innerWidth-20)/480;
		if(scale > 1) scale = 1;

		return {
			x: (evt.clientX - rect.left)/scale,
			y: (evt.clientY - rect.top)/scale
		}
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

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for(var y=0;y<6;y++){
			for(var x=0;x<8;x++){
				if(puzzle[y][x]){
					var imgPos = puzzle[y][x].puzzleData;
					ctx.drawImage(loadedImg, imgPos.x*60, imgPos.y*60, 60, 60, x*60, y*60, 60, 60);
				}
			}
		}

		puzzleData = ctx.getImageData(0, 0, 480, 360);

		ctx.lineWidth = 1;

		for(var y=0;y<6;y++){
			for(var x=0;x<8;x++){
				ctx.fillStyle="#fff";

				ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";;

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

		if(changeCell){
			ctx.strokeStyle = '#f00';
			ctx.rect(changeCell.x*60, changeCell.y*60, 60, 60);
			ctx.stroke();
		}
		
	}

	checkImageData = function(){
		if(w){
			w.postMessage({original:originalData, puzzle:puzzleData});
		}
	}

	if(w){
		w.onmessage = function(event){
			console.log(event.data);
			var wrongPieces = event.data;
			var ctx = canvas.getContext("2d");
			ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
			for(var i in wrongPieces){
				var x = wrongPieces[i].x;
				var y = wrongPieces[i].y;
				ctx.lineWidth = 5;
				line(x*60+10, y*60+10, x*60+50, y*60+50);
				line(x*60+10, y*60+50, x*60+50, y*60+10);
			}
			if(wrongPieces.length == 0){
				toggleWin();
			}
		}
	}

	toggleLoading = function(){
		document.getElementById("loadingdiv").classList.toggle("show");
	}

	toggleWin = function(){
		document.getElementById("windiv").classList.toggle("show");
		document.getElementById("counterwin").innerHTML = movements;
	}

	rePlay = function(){
		toggleWin();
		resetPuzzle();	
		updateCanvas();
		populatePieces();
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