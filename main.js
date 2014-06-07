//setup the Phaser game object.
var game = new Phaser.Game (800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update});

var paddle;
var ball;

var ballOnPaddle = true;

function preload () {

  //http://goo.gl/WVVCiU
  game.load.atlas ('breakout', 'assets/breakout.png', 'assets/breakout.json');

  //http://goo.gl/TN8P7q
  game.load.image ('starfield', 'assets/starfield.jpg');
}

function create () {

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


  /*BALL SECTION*/
  ball = game.add.sprite (game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
  ball.anchor.set (0.5);
  ball.checkWorldBounds = true;

  game.physics.enable (ball, Phaser.Physics.ARCADE);

  game.input.onDown.add (releaseBall, this);

}

function update () {

  //move paddle to the x coordinate of the mouse.
  paddle.body.x = game.input.x;

  //make the ball go along with paddle initally
  if (ballOnPaddle)
    ball.body.x = paddle.x;

}


function releaseBall () {

  if (ballOnPaddle) {
    ballOnPaddle = false;
    ball.body.velocity.y = - 300;
    ball.body.velocity.x = -75;
  }
}
