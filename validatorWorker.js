
var originalImageData;
var puzzleImageData

var piecesWrong = [];

//LISTEN FOR MESSAGES
self.addEventListener('message', function(e) {
	//console.log("Recibo "+e.data+" y envio CACA");

	originalImageData = e.data.original;
	puzzleImageData = e.data.puzzle;

	piecesWrong = [];

	for(var i=0;i<6;i++){
		for(var j=0;j<8;j++){
			if(checkPiece(j, i)) piecesWrong.push({x:j,y:i});
		}
	}

	self.postMessage(piecesWrong);

    //self.postMessage("CACA");
}, false);

checkPiece = function(x, y){

	for(var i=0;i<60;i++){
		for(var j=0;j<60;j++){

			var posX = 60*x + j;
			var posY = 60*y + i;
			var absPos = posY*480*4 + posX*4;

			//console.log("comparing "+originalImageData[absPos]+" and "+puzzleImageData[absPos]);
			for(var k=0;k<4;k++){
				var posK = absPos+k;

				if(originalImageData.data[posK] !== puzzleImageData.data[posK]){
				
					console.log("PIECE "+x+" "+y+" DIFFERENT");
					console.log("DIFFERENCE IN PIXEL "+originalImageData.data[posK]+" vs "+puzzleImageData.data[posK]);
					return true;
				}

			}

		}	
	}
	return false;

}
