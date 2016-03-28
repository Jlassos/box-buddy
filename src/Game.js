BoxBuddy.Game = function (game) {

}
// Debug
var showDebug = false;
//  Some Buddy Variables
var buddySpeed = 100;
var buddyJump = -150;
var tacosConsumed = 0;
var amountHealed = 0;
var timesHopped = 0;
var buddyHealth = 65;
var buddyMaxHealth = 75;
var buddyMinHealth = 0;
var healthBarHeight = 7;
var healthDecayTime = 0.3;
var healthDecayRate = 1;
//  random location to move to
var randomLocation = undefined;
var randomHopTime = undefined;

//  Delays for onclick
var delays = {
    frameCounter: 0,
    createTaco: 0,
    createTacoMinWait: 15
}

var entities = {
    tacoCounter: 0,
    targettedTaco: undefined,
    getRandomTaco: function () {
        return entities.tacos[Math.floor(Math.random() * entities.tacos.length)]
    },
    createTaco: function (x, y) {
        taco = game.add.sprite(x, y, 'taco')
        taco.id = entities.tacoCounter++
        taco.width = 20
        taco.height = 20
        taco.heal = 25
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

var platforms;
var tacoCrunch

BoxBuddy.Game.prototype = {

// Buddy will exist here eventually
//var buddy = {
//    health: 100,
//    maxHealth: 100,
//    healthDecayTime: 0.3,
//    healthDecayRate: 1,
//    speed: 100,
//    jump: -150,
//    tacosConsumed: 0,
//    healed: 0,
//    hopped: 0,
//}

    create: function () {
    //  Enable Arcade physics
    //game.physics.startSystem(Phaser.Physics.ARCADE)

    //  Add Game Sounds
    tacoCrunch = game.add.audio('tacoCrunch')


    //  Background
    background = game.add.sprite(0, 0, 'background');
    background.height = game.height
    background.width = game.width

    //  platforms
    platforms = game.add.group()

    //  physics for platform
    platforms.enableBody = true;

    //  create the ground.
    var ground = platforms.create(0, game.world.height - 8, 'ground');
    ground.width = game.world.width + 20
    ground.alpha = 0

    //  CREATE WALLS
    //  left wall
    var leftwall = platforms.create(0, 0, 'ground')
    leftwall.width = 22
    leftwall.height = game.height
    leftwall.alpha = 0
    //  right wall
    var rightwall = platforms.create(game.width, 0, 'ground')
    rightwall.width = 20
    rightwall.height = game.height
    rightwall.alpha = 0

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true
    leftwall.body.immovable = true
    rightwall.body.immovable = true

    //  creates our buddy - REFACTOR INTO CLASS ENTITY ASAP
    buddyGroup = game.add.group()
    buddy = buddyGroup.create(300, 300, 'box-buddy')
    //  buddy health bar background
    healthBarBackground = buddyGroup.create(buddy.x, buddy.y - 20, 'healthbarEmpty')
    healthBarBackground.width = 75
    healthBarBackground.height = healthBarHeight
    healthBarBackground.anchor.y = 0.5
    // buddy health bar fill
    healthBarFill = buddyGroup.create(buddy.x, buddy.y - 20, 'healthbarFull')
    healthBarFill.width = 0
    healthBarFill.height = healthBarHeight
    healthBarFill.anchor.y = 0.5
    // buddy feed me message
    feedMe = buddyGroup.create(buddy.x, buddy.y - 40, 'feedMe')
    feedMe.alpha = 0
    feedMe.anchor.set(0.5, 0.5)
    feedMe.scale.setTo(0.0, 0.0)

    //  enable physics
    //  need to redo buddy physics
    game.physics.arcade.enable(buddy)

    //  buddy physics properties
    buddy.body.bounce.y = 0.2
    buddy.body.gravity.y = 600
    buddy.body.collideWorldBounds = true
    buddy.anchor.set(0.5, 0.5)

    // random location gen
    function getRandomLocation() {
        return game.rnd.integerInRange(22, game.world.width)
    }

    // random hop time gen
    function getHopTime() {
        return game.rnd.integerInRange(1, 10)
    }

    //  Taco check
    game.time.events.loop(Phaser.Timer.SECOND * 5, checkForLocation, this)
    //  Check to see if there is a taco and declare target
    function checkForLocation() {
        if (entities.targettedTaco === undefined && entities.tacos.length > 0) {
            entities.targettedTaco = entities.getRandomTaco()
            console.dir(entities.targettedTaco)
            console.log("^ Target taco")
        }
        else {
            randomLocation = getRandomLocation()
            console.log(randomLocation)
            console.log("^ Target location")
        }
    }

    //  Get hungry loop
    //  decrease health by 1 every .3 seconds
    game.time.events.loop(Phaser.Timer.SECOND * healthDecayTime, getHungry, this)
    function getHungry() {
        if (healthBarFill.width > 0) {
            healthBarFill.width -= healthDecayRate
            console.log('Buddy is getting hungry!')
        }
        else {

        }
    }

    //  buddy hops
    buddyHopTime = game.time.events.loop(Phaser.Timer.SECOND * 7, buddyHop, this)
    function buddyHop() {
        if (buddy.body.touching.down = true) {
            buddy.body.velocity.y = buddyJump
            buddy.body.drag = 0.5
            timesHopped++
        }
    }

},

//  toggles the debug
 toggleDebug: function () {
    showDebug = (showDebug) ? false : true;
    if (!showDebug) {
        game.debug.reset();
    }
},

update: function() {
    //  Counts frames for creating taco
    delays.frameCounter += 1
    //  collide the buddy with stuff
    game.physics.arcade.collide(buddy, platforms)
    game.physics.arcade.collide(entities.tacos, platforms)
    game.physics.arcade.collide(entities.tacos, entities.tacos)
    cursors = game.input.keyboard.createCursorKeys();

    //  Debug Options
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        this.toggleDebug()
    }
    if (showDebug) {
        game.debug.cameraInfo(game.camera, 390, 32)
        game.debug.text("Tacos consumed " + tacosConsumed, 32, 32)
        game.debug.text("Tacos on screen " + entities.tacos.length, 32, 52)
        game.debug.text("Current Health " + healthBarFill.width, 32, 72)
        game.debug.text("Times Hopped " + timesHopped, 32, 92)
        game.debug.text("Amount Healed " + amountHealed, 32, 112)
        game.debug.text("Target location x = " + randomLocation, 32, 132)
        game.debug.body(buddy)
    }


    //  Click to create taco at active pointer location
    timeSinceWeCreatedATaco = delays.frameCounter - delays.createTaco
    if (game.input.activePointer.isDown && timeSinceWeCreatedATaco > delays.createTacoMinWait) {
        console.log("Summon taco at " + game.input.activePointer.x + ", " + game.input.activePointer.y)
        entities.createTaco(game.input.activePointer.x, game.input.activePointer.y);
        delays.createTaco = delays.frameCounter
    }
    //  feed me message - REFACTOR TO USE TEXT ASAP
    if (healthBarFill.width <= 0) {
        feedMe.alpha = 1
        feedMe.x = buddy.x
        feedMe.y = buddy.y - 35
        s = game.add.tween(feedMe.scale)
        s.to({x: 0.35, y: 0.35}, 1500, Phaser.Easing.Back.Out, true, 0, true)
    } else {
        feedMe.alpha = 0
        feedMe.scale.setTo(0.0, 0.0)
    }
    // Floating taco text
    function tacoText() {
        var moveText = game.add.text(buddy.x - 10, buddy.y - 45, '+' + taco.heal, {
            font: "20px consolas",
            fill: "#32CD32",
            align: "center"
        });
        var tween = game.add.tween(moveText).to({
            x: [buddy.x - 10, buddy.x - 60, buddy.x - 60],
            y: [buddy.y - 60, buddy.y - 90, buddy.y],
        }, 950, Phaser.Easing.Quadratic.Out, true).interpolation(function (v, k) {
            return Phaser.Math.bezierInterpolation(v, k);
        })
        game.add.tween(moveText).to({alpha: 0}, 900, "Linear", true)
        game.time.events.add(Phaser.Timer.SECOND * 1, cleanUpTacoText, this)
        function cleanUpTacoText() {
            moveText.destroy()
        }
    }

    //  Eat taco
    function eatTaco(buddy, taco) {
        //  reset target taco after being eaten
        entities.targettedTaco = undefined
        // plays floating taco text
        tacoText()
        //  play taco sound
        tacoCrunch.play('', 0, 1, false, false)
        //  remove taco from screen
        taco.kill()
        //  update taco array
        entities.tacos = entities.tacos.filter(function (item) {
            return item.id != taco.id
        })
        //  how many tacos eaten
        tacosConsumed++
        amountHealed += taco.heal
        //  health increase
        if (healthBarFill.width + taco.heal < buddyMaxHealth) {
            healthBarFill.width += taco.heal
        }
        else {
            healthBarFill.width = buddyMaxHealth
            //console.log('Too Overload!!')
        }
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
    // healthbar update position
    healthBarBackground.x = buddy.x - 35
    healthBarBackground.y = buddy.y - 20
    healthBarFill.x = buddy.x - 35
    healthBarFill.y = buddy.y - 20
    //
},
    quitGame: function () {
        this.state.start('MainMenu')
    }
}