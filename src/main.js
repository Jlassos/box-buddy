var game = new Phaser.Game(640, 360, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var delays = {
    frameCounter: 0,
    createTaco: 0,
    createTacoMinWait: 5
}

var entities = {
    tacoCounter: 0,
    createTaco: function(x, y) {
        taco = game.add.sprite(x, y, 'taco')
        taco.id = entities.tacoCounter++
        game.physics.arcade.enable(taco)
        //tacquito.width = 20
        //tacquito.height = 20

        // creates taco
        //tacoGroup = game.add.group()
        //tacoGroup.enableBody = true
        //for (var i = 1; i < 8; i++) {
        //var taco = tacoGroup.create(50, 50, 'taco')
        taco.width = 20
        taco.height = 20
        taco.anchor.set(0.5, 0.5)
        taco.body.gravity.y = 300
        taco.body.bounce.y = 0.5 + Math.random() * 0.2
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

    //  Background
    background = game.add.sprite(0, 0, 'background');
    background.height = game.height
    background.width = game.width;

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

    for(var i=1; i<8; i++) {


        entities.createTaco(i * 50, 100)
        //}
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
    delays.frameCounter += 1
    // collide the buddy with stuff
    game.physics.arcade.collide(buddy, platforms)
    //game.physics.arcade.collide(taco, platforms)
    //game.physics.arcade.overlap(buddy, taco, eatTaco, null, this)

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

    timeSinceWeCreatedATaco = delays.frameCounter - delays.createTaco
    if (game.input.activePointer.isDown && timeSinceWeCreatedATaco > delays.createTacoMinWait) {
        console.log("tacquitos are so good im so hungry")
        entities.createTaco(game.input.mousePointer.x, game.input.mousePointer.y);
        delays.createTaco = delays.frameCounter
    }

    // eat taco
    function eatTaco(buddy, taco) {
        // remove taco from screen
        console.log(taco.id)
        taco.kill()
    }
    //console.log(entities.tacos)
    if(entities.tacos.length > 0) {
        // if there are any tacos move towards the closest
        // get euclidian distance from all tacos, sort and move towards closest
        // to move towards closest just check X, if your X < theirs, X+, if your x > yours X-

        // plan B
        // randomly get a taco, do the x check and move towards it
        // entities.tacos[random.next(0, entities.tacos.length - 1)]
        //console.log('tacos around')

        // use javascript filter function to remove an item from the list
    } else {
        //console.log('dey gon')
    }

    entities.tacos.forEach(function(taco){
        //console.log(taco)
        /*if (buddy.x < taco.x) {
            buddy.body.velocity.x = 150
        }
        else {
            buddy.body.velocity.x = -150
        }*/
        //console.log(taco.y)

        game.physics.arcade.overlap(buddy, taco, eatTaco, null, this)
    });

}