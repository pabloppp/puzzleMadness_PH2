
var originalImageData;
var puzzleImageData

var piecesWrong = [];

//LISTEN FOR MESSAGES
self.addEventListener('message', function(e) {
	//console.log("Recibo "+e.data+" y envio CACA");

	originalImageData = e.data.original.data;
	puzzleImageData = e.data.puzzle.data;

	piecesWrong = [];

	for(var i=0;i<6;i++){
		for(var j=0;j<8;j++){
			if(checkPiece(j, i)){
				piecesWrong.push({x:j,y:i});
			}
		}
	}

	self.postMessage(piecesWrong);

}, false);


checkPiece = function(x, y){

	for(var i=0;i<60;i++){ // y
		for(var j=0;j<60*4;j += 4){ // x
			var pos = x*60*4 + j + (y*60+i)*480*4;
			for(var k=0;k<4;k++){
				if(originalImageData[pos+k] !== puzzleImageData[pos+k]) return true;
			}
		}
	}

	return false;

}
