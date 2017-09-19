bounce2(1000, 'linear', 20);

// maxBouncingTimes: 0 means no limit
function bounce2(duration, easing, maxBouncingTimes=0) {
  var box = { width:800, height:600 };
  var imgW = $('#ball').prop("width");
  var imgH = $('#ball').prop("height");
  // for duration adjustment
  var maxDistance = distance({x:0, y:0}, {x:box.width, y:box.height});
  //console.log("Box size: (w: " + box.width + ", h: " + box.height + ")");
  //console.log("Image size: (w: " + imgW + ", h: " + imgH + ")");
 
  // initialization
  var startPos = {x:0, y:0};
  var targetPos = getInitialHitPos.call(box);
  $('#ball').click(function() { 
    //alert("clicked!");
    $(this).finish();
  });
  // for debug
  //var startPos = {x:80, y:480};
  //var targetPos = {x:160, y:0};
  
  var pos = transform.call(box, targetPos, imgW, imgH);
  $('#ball').animate( { left:pos.left+'px', top:pos.top+'px' }, getDuration(duration, distance(startPos, targetPos), maxDistance), easing);
    
  if (maxBouncingTimes != 0) {
    var cnt = 1;  // total bouncing times
  }
  
  while (true) {
    var nextPos = getNextPos.call(box, startPos, targetPos);
    pos = transform.call(box, nextPos, imgW, imgH);
    $('#ball').animate( { left:pos.left+'px', top:pos.top+'px' }, getDuration(duration, distance(targetPos, nextPos), maxDistance), easing);
    if (maxBouncingTimes != 0) {
      cnt++;
    }
    
    if (isEndPos.call(box, nextPos)) {
      break;
    } else if ( maxBouncingTimes != 0 && cnt >= maxBouncingTimes) {
      break;
    }
    
    startPos = targetPos;
    targetPos = nextPos;
  }
}

//  Utility functions
//

function getTangentLength(length, tan) {
  return Math.round(length * tan);
}

function formatPos(pos) {
  return "(" + pos.x + ", " + pos.y + ")";
}

// Key function!
//
// this function should be called on a box object, which has following properties:
// width, height
function getNextPos(srcPos, targetPos) {
  // for test
  //return getRandomPos.call(this);
  //console.log("srcPos: " + formatPos(srcPos));
  //console.log("targetPos: " + formatPos(targetPos));
  var nextPos = {x:0, y:0}; // for debug purpose
  
  if (targetPos.y === this.height) {  // hit the bottom
    var xDiff = targetPos.x - srcPos.x;
    var xPatch = this.width - targetPos.x;
    let flag = "right"; // targetPos is on the right of srcPos
    if (xDiff < 0) {
      xDiff = 0 - xDiff;
      xPatch = this.width - xPatch;
      flag = "left";  // targetPos is on the left of srcPos
    }
    //console.log("flag: " + flag + ", xDiff: " + xDiff + ", xPatch: " + xPatch);
    
    // hy:xPatch = (this.height-srcPos.y):xDiff
    let hy = getTangentLength(xPatch, (this.height-srcPos.y)/xDiff);
    if (hy <= this.height) {  // will bounce to the right/left side
      if (flag === "right") {
        //return {x:this.width, y:this.height-hy};
        nextPos.x = this.width;
        nextPos.y = this.height-hy;
      } else {
        //return {x:0, y:this.height-hy};
        nextPos.x = 0;
        nextPos.y = this.height-hy;
      }
    } else {  //  hy > this.height, will bounce to the top side
      let wx = getTangentLength(this.height, xDiff/(this.height-srcPos.y));
      if (flag === "right") {
        //return {x:targetPos.x+wx, y:0};
        nextPos.x = targetPos.x+wx;
        nextPos.y = 0;
      } else {
        //return {x:targetPos.x-wx, y:0};
        nextPos.x = targetPos.x-wx;
        nextPos.y = 0;
      }
    }
  } else if (targetPos.x === this.width) { // hit the right
    var yDiff = srcPos.y - targetPos.y;
    var yPatch = targetPos.y;
    let flag = "top"; // targetPos is on the top of srcPos
    if (yDiff < 0) {
      yDiff = 0 - yDiff;
      yPatch = this.height - yPatch;
      flag = "bottom";  // targetPos is on the bottom of srcPos
    }
    //console.log("flag: " + flag + ", yDiff: " + yDiff + ", yPatch: " + yPatch);
    
    // wx:yPatch = (this.width-srcPos.x):yDiff
    let wx = getTangentLength(yPatch, (this.width-srcPos.x)/yDiff);
    if (wx <= this.width) { // will bounce to the top/bottom side
      if (flag === "top") {
        //return {x:this.width-wx, y:0};
        nextPos.x = this.width-wx;
        nextPos.y = 0;
      } else {
        //return {x:this.width-wx, y:this.height};
        nextPos.x = this.width-wx;
        nextPos.y = this.height;
      }
    } else {  //  wx <= this.width, will bounce to the left side
      let hy = getTangentLength(this.width, yDiff/(this.width-srcPos.x));
      if (flag === "top") {
        //return {x:0, y:targetPos.y-hy};
        nextPos.x = 0;
        nextPos.y = targetPos.y-hy;
      } else {
        //return {x:0, y:targetPos.y+hy};
        nextPos.x = 0;
        nextPos.y = targetPos.y+hy;
      }
    }  
  } else if (targetPos.y === 0) {  // hit the top
    var xDiff = srcPos.x - targetPos.x;
    var xPatch = targetPos.x;
    let flag = "left"; // targetPos is on the left of srcPos
    if (xDiff < 0) {
      xDiff = 0 - xDiff;
      xPatch = this.width - xPatch;
      flag = "right";  // targetPos is on the right of srcPos
    }
    //console.log("flag: " + flag + ", xDiff: " + xDiff + ", xPatch: " + xPatch);
    
    // hy:xPatch = srcPos.y:xDiff
    let hy = getTangentLength(xPatch, srcPos.y/xDiff);
    if (hy <= this.height) {  // will bounce to the left/right side
      if (flag === "left") {
        //return {x:0, y:hy};
        nextPos.x = 0;
        nextPos.y = hy;
      } else {
        //return {x:this.width, y:hy};
        nextPos.x = this.width;
        nextPos.y = hy;
      }
    } else {  //  hy > this.height, will bounce to the bottom side
      let wx = getTangentLength(this.height, xDiff/srcPos.y);
      if (flag === "left") {
        //return {x:targetPos.x-wx, y:this.height};
        nextPos.x = targetPos.x-wx;
        nextPos.y = this.height;
      } else {
        //return {x:targetPos.x+wx, y:this.height};
        nextPos.x = targetPos.x+wx;
        nextPos.y = this.height;
      }
    }
  } else if (targetPos.x === 0) { // hit the left
    var yDiff = targetPos.y - srcPos.y;
    var yPatch = this.height - targetPos.y;
    let flag = "bottom"; // targetPos is on the bottom of srcPos
    if (yDiff < 0) {
      yDiff = 0 - yDiff;
      yPatch = this.height - yPatch;
      flag = "top";  // targetPos is on the top of srcPos
    }
    //console.log("flag: " + flag + ", yDiff: " + yDiff + ", yPatch: " + yPatch);
    
    // wx:yPatch = srcPos.x:yDiff
    let wx = getTangentLength(yPatch, srcPos.x/yDiff);
    if (wx <= this.width) { // will bounce to the bottom/top side
      if (flag === "bottom") {
        //return {x:wx, y:this.height};
        nextPos.x = wx;
        nextPos.y = this.height;
      } else {
        //return {x:wx, y:0};
        nextPos.x = wx;
        nextPos.y = 0;
      }
    } else {  //  wx > this.width, will bounce to the right side
      let hy = getTangentLength(this.width, yDiff/srcPos.x);
      if (flag === "bottom") {
        //return {x:this.width, y:targetPos.y+hy};
        nextPos.x = this.width;
        nextPos.y = targetPos.y+hy;
      } else {
        //return {x:this.width, y:targetPos.y-hy};
        nextPos.x = this.width;
        nextPos.y = targetPos.y-hy;
      }
    }
  } else {
    alert("Why I'm here?!!!");
    nextPos = getRandomPos.call(this); // test
  }
  //console.log("nextPos: " + formatPos(nextPos));
  //console.log("==============================");
  if (nextPos.x < 0 || nextPos.y < 0) {
    alert("Strange nextPos: " + formatPos(nextPos)
        + "\nsrcPos: " + formatPos(srcPos)
        + "\ntargetPos: " + formatPos(targetPos));
  }
  return nextPos;
}

// assume the initial hit pos is in the bottom side (y == box.height)
function getInitialHitPos() {
  var xVal = this.width;  // to right side
  var yVal = this.height; // to bottom side
  if (Math.floor(Math.random() * 2) == 1) {
    // bounce to the right side
    yVal = Math.floor(Math.random() * this.height);  // [0, this.height)
  } else { // bounce to the bottom side
    xVal = Math.floor(Math.random() * this.width);   // [0, this.width)
  }  
  
  return {x: xVal, y:yVal};
  //return {x: 80, y:yVal}; // for debug
}

function getRandomPos() {
  // random pos return for test
  var xVal = Math.floor(Math.random() * this.width);   // [0, this.width)
  var yVal = Math.floor(Math.random() * this.height);  // [0, this.height)
  
  return {x: xVal, y:yVal};
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

function isEndPos(pos) {
  if (pos.x == 0) {
    if (pos.y == 0 || pos.y == this.height) {
      return true;
    }
  } else if (pos.x == this.width) {
    if (pos.y == 0 || pos.y == this.height) {
      return true;
    }
  }
  return false;
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

//  Initial demo from the OReilly's book:
//    Learning PHP, MySQL & JavaScript. With jQuery, CSS & HTML5 (4th Ed)
//    Chapter 21: Introduction to jQuery, Example 21-15, p527
//
/*
// 4 animations are counted once (as a circle trail)
// n is the total number of trails
// duration is animation duration in millisecond.
function bounce(n, duration, easing)
{
  //  Generate random numbers that satisfy a certain condition:
  //  left1: [0, boxWidth-imgWidth], top1 = boxHeight - imgHeight
  //  left2 = boxWidth-imgWidth, top2: [0, top1]
  //  left3 = left1, top3 = 0
  //  left4 = 0, top4 = top2
  //  So basically ,only 2 random numbers should be generated: left1 and top2
  
  var boxWidth = 640, boxHeight = 480;
  var imgWidth = 100, imgHeight = 100;
  var l2 = boxWidth - imgWidth;
  var t1 = boxHeight - imgHeight;
  for (var i=0; i<n; ++i) {
    var l1 = Math.round(Math.random() * (l2+1));  // integer in [0, l2]
    var t2 = Math.round(Math.random() * (t1+1));  // integer in [0, t1]
    
    $('#ball')
      .animate( { left:l1+'px', top :t1+'px' }, duration, easing)
      .animate( { left:l2+'px', top :t2+'px' }, duration, easing)
      .animate( { left:l1+'px', top :'0px'   }, duration, easing)
      .animate( { left:'0px',   top :t2+'px' }, duration, easing);
  }
}
*/

