//level 1 game victory screen

export default class GameWinScene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameWinScene3' });
    }

    create(data) {
        this.sound.stopAll();       //stops EVERYTHING from the previous scene (especially stepSFX)
        this.clickSFX = this.sound.add('clickSFX', { volume:0.8});
        this.hoverSFX = this.sound.add('hoverSFX', { volume:0.8});

        //delay the music AND game over screen for dramatic effect 
        this.winMusic = this.sound.add('winBG3', { volume: 1.8, loop: true });
        this.time.delayedCall(200, () => {
         this.winMusic.play();
        })
        this.time.delayedCall(2500, () => {
        this.add.image(750, 375, 'gamewin3');
        this.finalScore = data.score;
        this.finalGems = data.gems;
        this.add.text(750, 120, `Freedom... at last.`, { 
            fontSize: '130px', 
            fill: '#8c5d2f', 
            stroke: '#1e0f05',
            strokeThickness: 6,
            fontFamily: 'Yoster' 
        }).setOrigin(0.5);
        this.add.text(750, 590, `Final Score: ${this.finalScore}`, { 
            fontSize: '55px', 
            fill: '#8c5d2f', 
            stroke: '#1e0f05',
            strokeThickness: 6,
            fontFamily: 'Yoster' 
        }).setOrigin(0.5);
        
        this.add.text(750, 680, `Gems Gathered: ${this.finalGems} gems`, { 
            fontSize: '55px', 
            fill: '#8c5d2f', 
            stroke: '#1e0f05',
            strokeThickness: 6,
            fontFamily: 'Yoster' 
        }).setOrigin(0.5);

        //button setups
        const retryblue = this.add.image(370, 440, 'retryblue3').setScale(1.2);
        const stepbackblue = this.add.image(1130, 440, 'stepbackblue3').setScale(1.2);

        //retry button event listeners and interactivity (brings you to the first level)
        retryblue.setInteractive();
        retryblue.on('pointerover', () => {
            this.hoverSFX.play();
            retryblue.setScale(1.3); 
        });
 
        retryblue.on('pointerout', function () {
            retryblue.setScale(1.2); 
         });
 
        retryblue.setInteractive().on('pointerdown', () => {
            this.clickSFX.play();
            this.winMusic.stop();
            this.scene.pause();
            this.scene.start('GameScene');
         });
 
        //menu button event listeners and interactivity (brings you to main menu)
        stepbackblue.setInteractive();
        stepbackblue.on('pointerover', () => {
            this.hoverSFX.play();
            stepbackblue.setScale(1.3); 
        });
  
        stepbackblue.on('pointerout', function () {
            stepbackblue.setScale(1.2); 
          });
  
        stepbackblue.setInteractive().on('pointerdown', () => {
            this.winMusic.stop();
            this.clickSFX.play();
            this.scene.pause();
            this.scene.start('MainMenuScene');
         });
        })
    }
}