BoxBuddy.MainMenu =  function (game) {
    //this.music = null
}
BoxBuddy.MainMenu = {
    create: function () {

        var nameLabel = this.add.text(this.world.centerX, this.world.centerY, 'Box Buddy', {
            font: '50px Arial', fill: '#ffffff'
        })

        var startLabel = this.add.text(this.world.centerX + 50, this.world.centerY + 70, 'Click to start', {
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