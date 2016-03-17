var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//  Create this many tacos on load
//  If this value is 0 we get taco is not defined error
var tacoNumber = 0

//  Some Buddy Variables
var buddySpeed = 100
var buddyJump = 250
var tacosConsumed = 0
var buddyHealth = 100
var buddyMaxHealth
//  random location to move to
var randomLocation = undefined

//  Delays for onclick
var delays = {
    frameCounter: 0,
    createTaco: 0,
    createTacoMinWait: 15
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
        taco.width = 20
        taco.height = 20
        game.physics.arcade.enable(taco)
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
    game.load.audio('tacoCrunch', 'assets/tacoCrunch.mp3')

}

var platforms;
var tacoCrunch
function create() {

    //  Enable Arcade physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Add Game Sounds
    tacoCrunch = game.add.audio('tacoCrunch')


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

    // random location gen
    //  deciding where buddy wants to go 297 is middle integer
    function getRandomLocation(){
        return game.rnd.integerInRange(22, 616)
    }
    //  Time till eat taco
    game.time.events.loop(Phaser.Timer.SECOND * 4, checkForLocation, this)
    //  Check to see if there is a taco and declare target
    function checkForLocation() {
        if(entities.targettedTaco === undefined && entities.tacos.length > 0) {
            entities.targettedTaco = entities.getRandomTaco()
            console.dir(entities.targettedTaco)
            console.log("^ target")
        }
        else {
            randomLocation = getRandomLocation()
            console.log(randomLocation)
            console.log("^ target")
        }
    }

    game.sound.setDecodedCallback([tacoCrunch], update, this);

}

function start() {

}

function update() {
    //  Counts frames for creating taco
    delays.frameCounter += 1
    //  collide the buddy with stuff
    game.physics.arcade.collide(buddy, platforms)
    game.physics.arcade.collide(entities.tacos, platforms)
    game.physics.arcade.collide(entities.tacos, entities.tacos)
    cursors = game.input.keyboard.createCursorKeys();

    //  Debug Options
    //game.debug.text("Taco Time in: " + game.time.events.duration, 32, 32)
    //game.debug.body(buddy)


    //  MOVEMENT
    //  Move Left
    //if (cursors.left.isDown) {
    //    //  Move to the left
    //    buddy.body.velocity.x = -buddySpeed;
    //}
    ////  Move Right
    //else if (cursors.right.isDown) {
    //    //  Move to the right
    //    buddy.body.velocity.x = buddySpeed;
    //}
    ////  jump if on ground
    //if (cursors.up.isDown && buddy.body.touching.down) {
    //    buddy.body.velocity.y = -buddyJump;
    //}

    //  Click to create taco at mouse location
    timeSinceWeCreatedATaco = delays.frameCounter - delays.createTaco
    if (game.input.activePointer.isDown && timeSinceWeCreatedATaco > delays.createTacoMinWait) {
        console.log("summon taco at " + game.input.mousePointer.x + ", " + game.input.mousePointer.y)
        entities.createTaco(game.input.mousePointer.x, game.input.mousePointer.y);
        delays.createTaco = delays.frameCounter
    }

    //  Eat taco
    function eatTaco(buddy, taco) {
        //  reset target taco after being eaten
        entities.targettedTaco = undefined
        //  play taco sound
        tacoCrunch.play('', 0, 1, false, false)
        //  remove taco from screen
        taco.kill()
        //  update taco array
        entities.tacos = entities.tacos.filter(function (item) {
            return item.id != taco.id
        })
        tacosConsumed++
        //  taco eat debug
        console.log('taco number ' + taco.id + ' so good')
        console.log(tacosConsumed + ' tacos consumed')
        console.log(entities.tacos.length + ' tacos left')
    }

    //  Moves to location
    if (entities.targettedTaco !== undefined) {
        if (buddy.x < entities.targettedTaco.x) {
            buddy.body.velocity.x = buddySpeed
        }
        else {
            buddy.body.velocity.x = -buddySpeed
        }
        //  move to random location
    } else if (randomLocation !== undefined && entities.tacos.length == 0) {
        if (buddy.x < randomLocation) {
            buddy.body.velocity.x = buddySpeed
        }
        else {
            buddy.body.velocity.x = -buddySpeed
        }
    } else {
        buddy.body.velocity.x = 0
    }

    // When buddy reaches location set randomLocation to undefined
    if (buddy.x >= randomLocation - 1 && buddy.x < randomLocation + 1) {
        randomLocation = undefined
    }

    //  Give taco being eaten properties
    entities.tacos.forEach(function (taco) {
        game.physics.arcade.overlap(buddy, taco, eatTaco, null, this)
    });
}