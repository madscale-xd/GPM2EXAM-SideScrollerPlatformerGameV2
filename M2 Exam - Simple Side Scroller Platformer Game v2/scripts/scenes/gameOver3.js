//level 1 game over screen

export default class GameOverScene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene3' });
    }

    create(data) {
        this.sound.stopAll();       //stops EVERYTHING from the previous scene (especially stepSFX)
        this.clickSFX = this.sound.add('clickSFX', { volume:0.8});
        this.hoverSFX = this.sound.add('hoverSFX', { volume:0.8});

        //delay the music AND game over screen for dramatic effect 
        this.defeatMusic = this.sound.add('deathBG', { volume: 0.8, loop: true });
        this.time.delayedCall(200, () => {
         this.defeatMusic.play();
        })
        this.time.delayedCall(2300, () => {
        this.add.image(750, 375, 'gameover3');
        let finalScore = data.score;       //data object carries over the SCORE and GEMS stats from GameScene
        let finalGems = data.gems;
        this.add.text(750, 120, `IN THE BELLY OF\n THE BEAST...`, { 
            fontSize: '100px',
            fill: '#740909', 
            stroke: '#000000',
            strokeThickness: 6,
            fontFamily: 'Yoster' 
        }).setOrigin(0.5);
        this.add.text(750, 600, `Final Score: ${finalScore}`, { 
            fontSize: '45px', 
            fill: '#740909', 
            stroke: '#000000',
            strokeThickness: 6,
            fontFamily: 'Yoster' 
        }).setOrigin(0.5);
        
        this.add.text(750, 680, `Gems Gathered: ${finalGems} gems`, { 
            fontSize: '45px', 
            fill: '#740909', 
            stroke: '#000000',
            strokeThickness: 6,
            fontFamily: 'Yoster' 
        }).setOrigin(0.5);
        const retry = this.add.image(400, 500, 'retry3').setScale(1.1);
        const stepback = this.add.image(1100, 500, 'stepback3').setScale(1.1);

        //retry button event listeners and interactivity (brings you to the first level)
        retry.setInteractive();
        retry.on('pointerover', () => {
            this.hoverSFX.play();
            retry.setScale(1.2); 
        });
 
        retry.on('pointerout', function () {
            retry.setScale(1.1); 
         });
 
        retry.setInteractive().on('pointerdown', () => {
            this.clickSFX.play();
            this.defeatMusic.stop();
            this.scene.pause();
            this.scene.start('GameScene');
         });
 
        //menu button event listeners and interactivity (brings you to main menu)
        stepback.setInteractive();
        stepback.on('pointerover', () => {
            this.hoverSFX.play();
            stepback.setScale(1.2); 
        });
  
        stepback.on('pointerout', function () {
            stepback.setScale(1.1); 
          });
  
        stepback.setInteractive().on('pointerdown', () => {
            this.defeatMusic.stop();
            this.clickSFX.play();
            this.scene.pause();
            this.scene.start('MainMenuScene');
         });
        })
    }
}