//setup the Phaser game object.
var game = new Phaser.Game (800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update});

var paddle;
var ball;
var bricks;

var lives = 3;
var score = 0;

var livesText;
var introText;
var scoreText;

var ballOnPaddle = true;

var s;

var music;

function preload () {

  //http://goo.gl/WVVCiU
  game.load.atlas ('breakout', 'assets/breakout.png', 'assets/breakout.json');

  //http://goo.gl/TN8P7q
  game.load.image ('starfield', 'assets/starfield.jpg');

  //load the background music!
  game.load.audio ('background', ['assets/background.mp3', 'assets/background.ogg']);
}

function create () {

  music = game.add.audio ('background');

  //http://docs.phaser.io/Phaser.Physics.html
  //Basically we need some kind of physics engine to react to collisions.
  game.physics.startSystem (Phaser.Physics.ARCADE);

  //check for collision for all walls except the bottom one.
  game.physics.arcade.checkCollision.down = false;

  //http://docs.phaser.io/Phaser.TileSprite.html
  //basically its a repeating texture, automatically wraps on the edge.
  s = game.add.tileSprite (0,0,800,600, 'starfield');


  /**PADLE SECTION**/

  //add the paddle to the game.
  //position it somwhere at the bottom.
  paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
   //setting the anchor of any physic calculations to the middle of the ball
  paddle.anchor.setTo(0.5, 0.5);


  //add paddle to the physics engine!
  game.physics.enable (paddle, Phaser.Physics.ARCADE);
  paddle.body.CollideWorldBounds = true;
  paddle.body.bounce.set (1);
  paddle.body.immovable = true;


  /*BALL SECTION*/

  ball = game.add.sprite (game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
  ball.anchor.set (0.5);

  //is this required??
  ball.checkWorldBounds = true;

  game.physics.enable (ball, Phaser.Physics.ARCADE);

  //make sure its collide and not check! Silly mistake wasted half an hour!
  //ball.body.checkWorldBounds = true;
  ball.body.collideWorldBounds = true;
  //this is what makes ball bounce off the wall, paddle, etc!
  ball.body.bounce.set (1);
  ball.animations.add ('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png','ball_4.png', 'ball_5.png'], 50, true, false);

  //if the ball went below the screen, restart the game!
  ball.events.onOutOfBounds.add (ballLost, this);

  /*BRICKS SECTION*/
  bricks = game.add.group ();
  bricks.enableBody = true;
  bricks.physicsBodyType = Phaser.Physics.ARCADE;

  var brick;
  for (var y = 0; y < 4; y++){
    for (var x = 0; x < 15; x++) {
      brick = bricks.create (120 + (x * 36), 100 + (y * 52), 'breakout', 'brick_' + (y+1) + '_1.png');
      brick.body.bounce.set (1);
      brick.body.immovable = true;
    }
  }

  /*TEXT SECTION*/
  livesText = game.add.text(680, 550, 'lives: 3', { font: "20px Arial", fill: "#ffffff", align: "left" });
  introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
  introText.anchor.setTo(0.5, 0.5);
  scoreText = game.add.text (32, 550, 'score: 0', { font: "20px Arial", fill: "#ffffff", align: "left"});

  game.input.onDown.add (releaseBall, this);

}

function update () {

  //move paddle to the x coordinate of the mouse.
  paddle.body.x = game.input.x;

  //this keeps the paddle and the ball within the game world width.
  if (paddle.x < 24)
  {
    paddle.x = 24;
  }
  else if (paddle.x > game.width - 24)
  {
    paddle.x = game.width - 24;
  }

  //make the ball go along with paddle initally
  if (ballOnPaddle)
    ball.body.x = paddle.x;
  else {
    //check if ball and paddle got hit!
    game.physics.arcade.collide (ball, paddle, ballHitPaddle, null, this);

    //check if ball and brick got hit!
    game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);

  }

}


function releaseBall () {

  if (ballOnPaddle) {

    //let the music play!
    music.play ();

    ballOnPaddle = false;
    ball.body.velocity.y = - 300;
    ball.body.velocity.x = -75;

    //start ball animations
    ball.animations.play ('spin');

    //remove the introtext
    introText.visible = false;
  }
}

function ballHitPaddle (_ball, _paddle) {
  var diff = 0;

  if (_ball.x === paddle.x)
    _ball.body.velocity.x = 2 + Math.random() * 8;
  else
    _ball.body.velocity.x = (10 * (ball.x - _paddle.x));

}

//what is _ball and _brick? Are they some special vars?
function ballHitBrick (_ball, _brick) {

  _brick.kill ();
  score += 10;

  scoreText.text = "score: " + score;

  //Any more bricks Yo?
  if (bricks.countLiving () == 0) {
    //Star new Level
    score += 1000;
    scoreText.text = 'score: ' + score;
    introText.text = '-- Next Level --';
    //missing in the docs
    introText.visible = true;

    ballOnPaddle = true;
    ball.body.velocity.set (0);
    ball.reset (paddle.body.x + 16, paddle.y - 16);
    ball.animations.stop ();

    bricks.callAll ('revive');
  }

}

function ballLost () {

  music.stop ();

  lives--;
  livesText.text = 'lives: ' + lives;

  if (lives === 0)
    gameOver ();
  else
  {
    ballOnPaddle = true;
    ball.reset (paddle.body.x + 16, paddle.y - 16);
    ball.animations.stop ();
  }
}

function gameOver () {

  ball.body.velocity.setTo (0,0);

  //set intro
  introText.text = "Game Over!";
  introText.visible = true;

  //reset score
  score = 0;
  scoreText.text = "score: " + score;

  //reset lives
  lives = 3;
  livesText.text = "lives: " + lives;

  //reset paddle!
  ballOnPaddle = true;
  ball.reset (paddle.body.x + 16, paddle.y - 16);
  ball.animations.stop ();
}
