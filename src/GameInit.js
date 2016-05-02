//	Create your Phaser game and inject it into the game div.
    var game = new Phaser.Game(960, 640, Phaser.AUTO, 'game-div');
//	Add the States your game has.
    game.state.add('Boot', BoxBuddy.Boot);
    game.state.add('Preloader', BoxBuddy.Preloader);
    game.state.add('MainMenu', BoxBuddy.MainMenu);
    game.state.add('Game', BoxBuddy.Game);
//	Now start the Boot state.
    game.state.start('Boot');
