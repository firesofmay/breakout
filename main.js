//setup the Phaser game object.
var game = new Phaser.Game (800, 600, Phaser.AUTO, 'game_div', { preload: preload, create: create, update: update});

function preload () {

  //read up on atlas. Something to do with loading the whole spritesheet in once.
  game.load.atlas ('breakout', 'assets/breakout.png', 'assets/breakout.json');
  game.load.image ('starfield', 'assets/starfield.jpg');
}

function create () {

  s = game.add.tileSprite (0,0,800,600, 'starfield');
}

function update () {

}
