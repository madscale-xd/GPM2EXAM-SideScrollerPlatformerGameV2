//main menu scene

export default class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }

    create() {
        //sfx
        this.clickSFX = this.sound.add('clickSFX', { volume:0.8});
        this.hoverSFX = this.sound.add('hoverSFX', { volume:0.8});


        this.add.image(0,0, 'forest').setOrigin(0).setScale(1.2);
        this.add.image(780,0, 'forest').setOrigin(0).setScale(1.2);
        this.add.image(780,750, 'neck').setOrigin(0.5).setScale(1.8);
        this.add.image(750,375, 'titleBG').setOrigin(0.5).setScale(0.7);

        //button setups
        const launch = this.add.image(420, 520, 'launch').setScale(0.8);
        const about = this.add.image(750, 520, 'about').setScale(0.8);
        const exit = this.add.image(1080, 520, 'exit').setScale(0.8);

        if (!this.menuMusic || !this.menuMusic.isPlaying) { //prevent bgm from duplicating
            this.menuMusic = this.sound.add('menuBG', { volume: 0.8, loop: true });
            this.menuMusic.play();
        }

        //launch button event listeners and interactivity (brings you to the actual game)
        launch.setInteractive();
        launch.on('pointerover', () => {
            this.hoverSFX.play();
            launch.setScale(0.9); 
        });

        launch.on('pointerout', function () {
            launch.setScale(0.8); 
        });

        launch.setInteractive().on('pointerdown', () => {
            this.menuMusic.stop();
            this.scene.pause();
            this.clickSFX.play();
            this.scene.start('GameScene');
        });

        //about button event listeners and interactivity (brings you to credits)
         about.setInteractive();
         about.on('pointerover', () => {
            this.hoverSFX.play();
            about.setScale(0.9); 
        });
 
         about.on('pointerout', function () {
            about.setScale(0.8); 
         });
 
        about.setInteractive().on('pointerdown', () => {
            this.scene.pause();
            this.clickSFX.play();
            this.scene.start('CredScene');
        });

        //exit button event listeners and interactivity (prompts an alert and exits the tab)
          exit.setInteractive();
          exit.on('pointerover', () => {
            this.hoverSFX.play();
            exit.setScale(0.9); 
        });

        exit.on('pointerout', function () {
            exit.setScale(0.8); 
        });

        exit.setInteractive().on('pointerdown', () => {
            this.clickSFX.play();
            alert('That\'s the wrong way out, Mushy! NOOOOOOOOOO!!!');
            window.close();
        });
    }
}