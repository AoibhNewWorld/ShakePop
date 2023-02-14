var balloon_1 = new Image();
balloon_1.src = "balloon.png";

var pop = new Image();
pop.src = "pop.png";

var balloons = [];
var pops = [];
var scr = 0;

var popSound = new Audio();
popSound.src = "popSound.mp3";

var hitSound = new Audio();
hitSound.src = "hitSound.mp3";

var loseSound = new Audio();
loseSound.src = "loseSound.mp3";

window.addEventListener("load", function (event) {
  var animProp = {
    animate: false
  };

  var health = 5;

  var cursor = document.getElementById("cursor")
  var canvas = document.getElementById("canvas")
  cursor.addEventListener("click", function () {
    if (cursor.value == 'daggers') {
      canvas.style.cursor = "url(cursor.png),auto";
      cursor.src = "cursor.png"
      cursor.value = "dart"
    } else {
      canvas.style.cursor = "url(daggers-cursor.png),auto";
      cursor.src = "daggers-cursor.png"
      cursor.value = "daggers"
    }
  });

  document.getElementById("start").addEventListener("click", function () {
    if (animProp.animate) {
      document.getElementById("start").value = "Start";
      animProp.animate = false;
    } else {
      document.getElementById("start").value = "Stop";
      animProp.animate = true;
      var date = new Date();
      var time = date.getTime();
      canvasInit(time, animProp, health);
    }
  });

  document.getElementById("reset").addEventListener("click", function () {
    var context = document.getElementById("canvas").getContext("2d");
    document.getElementById("start").value = "Start";
    animProp.animate = false;
    var canvas_width = context.canvas.width;
    var canvas_height = context.canvas.height;
    context.clearRect(0, 0, canvas_width, canvas_height);
    balloons = [];
    scr = 0;
    health = 5;
    document.getElementById("health").innerHTML = "Health: 5";
    document.getElementById("scr").innerHTML = "Score: 0";
  });
});

var canvasInit = function (lastTime, animProp, health) {
  var ctx = document.getElementById("canvas").getContext("2d");
  var canvasWidth = ctx.canvas.width;
  var canvasHeight = ctx.canvas.height;
  var start = false;
  var randomBalloon = null;
  var spawnRate = 750;
  var spawnRateOfDescent = 5;
  var animationID;
  var lastSpawn = -1;
  var healthDOM = document.getElementById("health");
  var scoreDOM = document.getElementById("scr");
  var mouseX = 0;
  var mouseY = 0;

  function Balloon() {
    this.render = function (balloon, x, y) {
      ctx.drawImage(balloon, x, y);
    };
  }

  function Pop() {
    this.render = function (x, y) {
      ctx.drawImage(pop, x, y);
    };

    this.clear = function (x, y) {
      ctx.clearRect(x, y, x + 50, y + 50);
    };
  }

  function GameOverDisplay() {
    ctx.fillStyle = "rgba(168, 0, 0, 1)";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
      `You LOST to Shake? You're BENCHED.`,
      canvasWidth / 2,
      canvasHeight / 2
    );
  }

  var balon = new Balloon();
  var POP = new Pop();
  //random ballon generation , adding to object

  function addBalloon() {
    var x = ~~(Math.random() * (canvasWidth - 95)) + 10;
    var y = canvasHeight;
    var rand = Math.random();
    balloons.push({ x: x, y: y });
  }

  //animate function
  var animate = function () {
    if (animProp.animate) {
      var time = Date.now();
      if (time > lastSpawn + spawnRate) {
        lastSpawn = time;
        addBalloon();
        spawnRate -= 2;
        spawnRateOfDescent += 0.1;
      }

      var date = new Date();
      var time1 = date.getTime();
      var timeDiff = time1 - lastTime;
      lastTime = time1;
      requestAnimationFrame(function () {
        animate();
      });

      for (var i = 0; i < balloons.length; i++) {
        var object = balloons[i];

        ctx.clearRect(object.x, object.y, 95, 155);
        object.y -= spawnRateOfDescent;
        balon.render(balloon_1, object.x, object.y);
        if (object.y <= 0) {
          ctx.clearRect(object.x, object.y, 95, 155);
          balloons.splice(i, 1);
          hitSound.play();
          health -= 1;
          scr -= 10;
          healthDOM.innerHTML = "Health: " + health;
          scoreDOM.innerHTML = "Score: " + scr;
        }
      }

      if (health <= 0) {
        animProp.animate = false;
        loseSound.play();
        GameOverDisplay();
      }
    }
  };

  if (animProp.animate) {
    animate();
  }

  /////////////////////////////////////////////////////
  /**Listeners**/
  ////////////////////////////////////////////////////
  ctx.canvas.addEventListener("mousedown", function (event) {
    mouseX = event.clientX - ctx.canvas.offsetLeft;
    mouseY = event.clientY - ctx.canvas.offsetTop;
    if (animProp.animate) {
      for (var i = 0; i < balloons.length; i++) {
        if (
          mouseY > balloons[i].y &&
          mouseY < balloons[i].y + 155 &&
          mouseX > balloons[i].x &&
          mouseX < balloons[i].x + 95
        ) {
          ctx.clearRect(balloons[i].x, balloons[i].y, 95, 155);
          POP.render(mouseX, mouseY);
          POP.clear((balloons[i].x + 95) / 2, (balloons[i].y + 155) / 2);
          popSound.play();
          balloons.splice(i, 1);
          scr++;
          scoreDOM.innerHTML = "Score: " + scr;
        }
      }
    }
  });
};
