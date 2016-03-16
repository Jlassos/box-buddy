var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var tacoNumber = 8
var buddySpeed = 100
var buddyJump = 250
var delays = {
    frameCounter: 0,
    createTaco: 0,
    createTacoMinWait: 45
}
//var buddy = {
//    speed: asdf,
//    jump: awhefawef
//
//}
var entities = {
    tacoCounter: 0,
    targettedTaco: undefined,
    getRandomTaco: function() {
        return entities.tacos[Math.floor(Math.random() * entities.tacos.length)]
    },
    createTaco: function(x, y) {
        taco = game.add.sprite(x, y, 'taco')
        taco.id = entities.tacoCounter++
        game.physics.arcade.enable(taco)
        taco.width = 20
        taco.height = 20
        taco.anchor.set(0.5, 0.5)
        taco.body.gravity.y = 400
        taco.body.bounce.y = 0.5 + Math.random() * 0.2
        taco.body.bounce.x = 0.5 + Math.random() * 0.2
        taco.body.collideWorldBounds = true
        entities.tacos.push(taco)
    },
    tacos: []
}

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
    // enable P2 physics
    //game.physics.startSystem(Phaser.Physics.P2JS)

    //  Background
    background = game.add.sprite(0, 0, 'background');
    background.height = game.height
    background.width = game.width;

    //  platforms
    platforms = game.add.group();

    //  physics for platform
    platforms.enableBody = true;

    //  create the ground.
    var ground = platforms.create(0, game.world.height - 8, 'ground');
    ground.alpha = 0

    //  CREATE WALLS
    //  left wall
    var leftwall = platforms.create(0, 0, 'ground')
    leftwall.width = 22
    leftwall.height = game.height
    leftwall.alpha = 0
    //  right wall
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

    //  creates our buddy - Refactor buddy into buddy entity
    buddy = game.add.sprite(300, 100, 'box-buddy')

    //  creates tacos
    for(var i=1; i < tacoNumber; i++) {
      entities.createTaco(i * 50, 100)
    }
    //  enable physics
    //  need to redo buddy physics
    game.physics.arcade.enable(buddy)

    //  buddy physics properties
    buddy.body.bounce.y = 0.2
    buddy.body.gravity.y = 600
    buddy.body.collideWorldBounds = true
    buddy.anchor.set(0.5, 0.5)



}

function update() {
    //  Counts frames for creating taco
    delays.frameCounter += 1
    //  collide the buddy with stuff
    game.physics.arcade.collide(buddy, platforms)
    game.physics.arcade.collide(entities.tacos, platforms)
    game.physics.arcade.collide(entities.tacos, entities.tacos)
    game.physics.arcade.overlap(buddy, taco, eatTaco, null, this)

    cursors = game.input.keyboard.createCursorKeys();

    //  Debug stuff
    //game.debug.body(buddy)

    //  MOVEMENT
    //  Move Left
    if (cursors.left.isDown) {
        //  Move to the left
        buddy.body.velocity.x = -buddySpeed;
    }
    //  Move Right
    else if (cursors.right.isDown) {
        //  Move to the right
        buddy.body.velocity.x = buddySpeed;
    }
    //  jump if on ground
    if (cursors.up.isDown && buddy.body.touching.down) {
        buddy.body.velocity.y = -buddyJump;
    }

    //  Click to create taco at mouse location
    timeSinceWeCreatedATaco = delays.frameCounter - delays.createTaco
    if (game.input.activePointer.isDown && timeSinceWeCreatedATaco > delays.createTacoMinWait) {
        console.log("summon taco " + game.input.mousePointer.x + ", " + game.input.mousePointer.y)
        entities.createTaco(game.input.mousePointer.x, game.input.mousePointer.y);
        delays.createTaco = delays.frameCounter
    }

    //  eat taco
    function eatTaco(buddy, taco) {
        entities.targettedTaco = undefined
        //  remove taco from screen
        taco.kill()
        //  update taco array
        entities.tacos = entities.tacos.filter(function(item) {
            return item.id != taco.id
        })
        //  taco eat debug
        console.log('taco number ' + taco.id + ' so good')
        console.log(entities.tacos.length)
    }

    //  Checks for tacos
    if(entities.targettedTaco === undefined && entities.tacos.length > 0) {
        entities.targettedTaco = entities.getRandomTaco()
        console.dir(entities.targettedTaco + ' is target')
    }

    //  Moves to taco
    if(entities.targettedTaco !== undefined) {
        if (buddy.x < entities.targettedTaco.x) {
            buddy.body.velocity.x = buddySpeed
        }
        else {
            buddy.body.velocity.x = -buddySpeed
        }
    } else {
        //  Wandering mode
        buddy.body.velocity.x = 0
    }
    //  Give taco being eaten properties
    entities.tacos.forEach(function(taco){
        game.physics.arcade.overlap(buddy, taco, eatTaco, null, this)
    });

}