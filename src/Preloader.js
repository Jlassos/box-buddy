BoxBuddy.Preloader = function (game) {

}

BoxBuddy.Preloader = {
    preload: function() {
        // Loading label
        var loadingLabel = this.add.text(game.world.centerX, game.world.centerY, 'Loading......', {font: '30px Consolas', fill: '#ffffff'})


        // Load assets
        this.load.image('background', 'assets/box-background2.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('box-buddy', 'assets/box-buddy.png');
        this.load.image('taco', 'assets/taco.png')
        this.load.image('healthbarFull', 'assets/healthbarFull.png')
        this.load.image('healthbarEmpty', 'assets/healthbarEmpty.png')
        this.load.image('feedMe', 'assets/feedme.png')
        this.load.audio('tacoCrunch', 'assets/tacoCrunch.mp3')
    },

    create: function() {
        //call menu state
        this.state.start('MainMenu')
    }

}