//	Create your Phaser game and inject it into the game div.
    var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game-div');
//	Add the States your game has.
//	You don't have to do this in the html, it could be done in your Boot state too, but for simplicity I'll keep it here.
    game.state.add('Boot', BoxBuddy.Boot);
    game.state.add('Preloader', BoxBuddy.Preloader);
    game.state.add('MainMenu', BoxBuddy.MainMenu);
    game.state.add('Game', BoxBuddy.Game);
//	Now start the Boot state.
    game.state.start('Boot');