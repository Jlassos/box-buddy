

BoxBuddy = {


}

BoxBuddy.Boot = function (game) {

}

BoxBuddy.Boot = {
    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }

    },

    preload: function () {
        // Load Assets for Preloader here

        // Like a loading bar or background image
    },

    create: function () {
        // Start Physics
        game.physics.startSystem(Phaser.Physics.ARCADE)

        // Call Load state
        this.state.start('Preloader');

    },
    // Not currently Used
    gameResized: function (width, height) {
    },

    enterIncorrectOrientation: function () {

        BoxBuddy.orientated = false;

        document.getElementById('orientation').style.display = 'block';

    },

    leaveIncorrectOrientation: function () {

        BoxBuddy.orientated = true;

        document.getElementById('orientation').style.display = 'none';
        game.scale.refresh()


    }

}