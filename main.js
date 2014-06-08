var game = new Phaser.Game (800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update});

var paddle;
var ball;

var ballOnPaddle = true;

var s;

function preload () {

  game.load.atlas ('breakout', 'assets/breakout.png', 'assets/breakout.json');
  game.load.image ('starfield', 'assets/starfield.jpg');
}

function create () {

  game.physics.startSystem (Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false;

  s = game.add.tileSprite (0,0,800,600, 'starfield');

  /**PADLE SECTION**/
  paddle = game.add.sprite(game.world.centerX, 500, 'breakout', 'paddle_big.png');
  paddle.anchor.setTo(0.5, 0.5);

  game.physics.enable (paddle, Phaser.Physics.ARCADE);
  paddle.body.CollideWorldBounds = true;
  paddle.body.bounce.set (1);
  paddle.body.immovable = true;


  /*BALL SECTION*/
  ball = game.add.sprite (game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
  ball.anchor.set (0.5);
  ball.checkWorldBounds = true;

  game.physics.enable (ball, Phaser.Physics.ARCADE);
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set (1);

  game.input.onDown.add (releaseBall, this);
}

function update () {

  paddle.body.x = game.input.x;

  if (paddle.x < 24)
  {
    paddle.x = 24;
  }
  else if (paddle.x > game.width - 24)
  {
    paddle.x = game.width - 24;
  }

  if (ballOnPaddle)
    ball.body.x = paddle.x;
  else {
    game.physics.arcade.collide (ball, paddle, ballHitPaddle, null, this);
  }

}


function releaseBall () {

  if (ballOnPaddle) {

    ballOnPaddle = false;
    ball.body.velocity.y = - 300;
    ball.body.velocity.x = -75;

  }
}

function ballHitPaddle (_ball, _paddle) {
    var diff = 0;

    if (_ball.x < _paddle.x)
    {
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }

}
