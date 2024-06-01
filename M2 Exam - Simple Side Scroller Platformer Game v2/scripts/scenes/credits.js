//credits portion (about)

export default class CredScene extends Phaser.Scene {
    constructor() {
        super('CredScene');
    }
    create() {
        this.clickSFX = this.sound.add('clickSFX', { volume:0.8});
        this.hoverSFX = this.sound.add('hoverSFX', { volume:0.8});
        
        this.add.image(0,0, 'forest').setOrigin(0).setScale(1.2);
        this.add.image(780,0, 'forest').setOrigin(0).setScale(1.2);
        
        const menu1 = this.add.image(750, 615, 'back');
        this.add.image(750,280, 'credBG').setOrigin(0.5).setScale(0.7);
        
        //menu button event listeners and interactivity (brings you to main menu)
        menu1.setInteractive(); 
        menu1.on('pointerdown', () => {
            this.clickSFX.play();
            this.scene.pause();
            this.scene.start('MainMenuScene'); 
        });
        menu1.on('pointerover', () => {
            this.hoverSFX.play();
            menu1.setScale(1.1); 
        });
        menu1.on('pointerout', function () {
            menu1.setScale(1); 
        });
    }
}