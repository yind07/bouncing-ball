setup();

function bounceNew(event) {
  var boxH = event.target.parentElement.clientHeight;
  var boxW = event.target.parentElement.clientWidth;
  var box = { width:boxW, height:boxH };
  
  var imgH = event.target.clientHeight;
  var imgW = event.target.clientWidth;
  //console.log("parent box Height: " + boxH);
  // assume the box shows up fully, no scrollbars.
  console.log("click at: (" + event.clientX + ", " + event.clientY + ")");
  var maxDistance = boxH - event.clientY;
  console.log("maxDistance: " + maxDistance);
  var df = 0.9; //  Damping Factor
  var newDistance = maxDistance;
  
  var xVal = boxW/2;
  while (true) {
    let nextPos = {x:xVal, y:boxH};  // the bottom hit point
    console.log("nextPos: " + formatPos(nextPos));
    
    var pos = transform.call(box, nextPos, imgW, imgH);
    $('#ball').animate( { left:pos.left+'px', top:pos.top+'px' }, getDuration(600, newDistance, maxDistance), "linear");
    
    newDistance = Math.floor(newDistance * df);
    console.log("newDistance: " + newDistance);
    nextPos = {x:xVal, y:boxH-newDistance};
    console.log("nextPos: " + formatPos(nextPos));
    var pos = transform.call(box, nextPos, imgW, imgH);
    $('#ball').animate( { left:pos.left+'px', top:pos.top+'px' }, getDuration(600, newDistance, maxDistance), "linear");
    
    if (newDistance == 0) {
      break;
    }
    console.log("===========================");
  }
}

function setup() {
  var box = { width:800, height:600 };
  var imgW = $('#ball').prop("width");
  var imgH = $('#ball').prop("height");
  
  var startPos = getStartPos.call(box);
  console.log("startPos: " + formatPos(startPos));
  
  var maxDistance = startPos.y;
  // initialize the start point!
  var pos = transform.call(box, startPos, imgW, imgH);
  $('#ball').css({left:pos.left+'px', top:pos.top+'px'});
  $('#ball').click(bounceNew);
}

function getStartPos() {
  var xVal = this.width/2;  // in the middle
  var yVal = this.height - Math.floor(Math.random() * this.height/2 + this.height/2);
  
  return {x: xVal, y:yVal};
}

//  Utility functions
//

function getTangentLength(length, tan) {
  return Math.round(length * tan);
}

function formatPos(pos) {
  return "(" + pos.x + ", " + pos.y + ")";
}

// get left and top, given bouncing image size and coordinate
// called by box
function transform(pos, imgW, imgH) {
  var leftVal = pos.x - imgW/2;
  var topVal = pos.y - imgH/2;
  
  // adjustment
  var maxLeftVal = this.width - imgW;
  var maxTopVal = this.height - imgH;
  if (leftVal < 0) {
    leftVal = 0;
  } else if (leftVal > maxLeftVal) {
    leftVal = maxLeftVal;
  }
  if (topVal < 0) {
    topVal = 0;
  } else if (topVal > maxTopVal) {
    topVal = maxTopVal;
  }
  
  return {left: leftVal, top: topVal};
}

// return adjusted duration
// to make simulation more real...
function getDuration(duration, distance, maxDistance) {
  if (typeof duration === "number") {
    return Math.round(distance/maxDistance * duration);
  }
  return duration;
}

function distance(posA, posB) {
  return Math.sqrt((posB.x-posA.x)*(posB.x-posA.x), (posB.y-posA.y)*(posB.y-posA.y));
}