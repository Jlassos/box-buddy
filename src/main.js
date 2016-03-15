var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('background', 'assets/box-background.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('box-buddy', 'assets/box-buddy.png');
    game.load.image('taco', 'assets/taco.png')

}

var platforms;

function create() {

    //  Enable Arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Background
    background = game.add.sprite(0, 0, 'background');
    background.height = game.height
    background.width = game.width

    //  platforms
    platforms = game.add.group();

    //  physics for platform
    platforms.enableBody = true;

    // create the ground.
    var ground = platforms.create(0, game.world.height - 8, 'ground');
    ground.alpha = 0

    // create walls
    // left wall
    var leftwall = platforms.create(0, 0, 'ground')
    leftwall.width = 22
    leftwall.height = game.height
    leftwall.alpha = 0

    // right wall
    var rightwall = platforms.create(616, 0, 'ground')
    rightwall.width = 20
    rightwall.height = game.height
    rightwall.alpha = 0

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true
    leftwall.body.immovable = true
    rightwall.body.immovable = true

    // creates our buddy
    // buddy movement
    //assignBuddyMovement = function(buddy) {
      //  buddyposition = Math.floor(this.rnd.realInRange(50, this.world.width-50))
       // buddyDelay = this.rnd.integerInRange(2000, 6000)
   // }
    buddy = game.add.sprite(50, 50, 'box-buddy')
    this.buildTacos

    // creates taco
        tacoGroup = game.add.group()
        tacoGroup.enableBody = true
        for (var i = 1; i < 8; i++) {
            var taco = tacoGroup.create(100,70, 'taco')
            taco.width = 20
            taco.height = 20
            taco.anchor.set(0.5, 0.5)
            taco.body.gravity.y = 300
            taco.body.bounce.y = 0.5 + Math.random() * 0.2
            taco.body.collideWorldBounds = true
        }
    // enable physics
    game.physics.arcade.enable(buddy)

    // buddy physics properties
    buddy.body.bounce.y = 0.2
    buddy.body.gravity.y = 600
    buddy.body.collideWorldBounds = true
    buddy.anchor.set(0.5, 0.5)


}

function update() {
    // collide the buddy with stuff
    game.physics.arcade.collide(buddy, platforms)
    game.physics.arcade.collide(tacoGroup, platforms)
    game.physics.arcade.overlap(buddy, tacoGroup, eatTaco, null, this)

    cursors = game.input.keyboard.createCursorKeys();

    //  Reset (movement)
    buddy.body.velocity.x = 0;

    // movement
    if (cursors.left.isDown) {
        //  Move to the left
        buddy.body.velocity.x = -150;
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        buddy.body.velocity.x = 150;
    }
    //  jump if on ground
    if (cursors.up.isDown && buddy.body.touching.down) {
        buddy.body.velocity.y = -350;
    }

    // eat taco
    function eatTaco(buddy, taco) {
        // remove taco from screen
        taco.kill()
    }
    if (buddy.x < taco.x) {
        buddy.body.velocity.x = 150
    }
}