BoxBuddy.MainMenu =  function (game) {
    //this.music = null
}
BoxBuddy.MainMenu = {
    create: function () {

        var nameLabel = this.add.text(window.innerHeight / 2, window.innerWidth / 2, 'Box Buddy', {
            font: '50px Arial', fill: '#ffffff'
        })

        var startLabel = this.add.text(window.innerHeight / 2, window.innerWidth / 2 + 50, 'Click to start', {
            font: '25px Arial',
            fill: '#ffffff'
        })
    },
    update: function () {
      if (game.input.activePointer.isDown) {
          this.startGame()
      }
    },
    // Call play state
    startGame: function () {
        this.state.start('Game')
    }
}
//this.scale.setGameSize(window.innerWidth, window.innerHeight)