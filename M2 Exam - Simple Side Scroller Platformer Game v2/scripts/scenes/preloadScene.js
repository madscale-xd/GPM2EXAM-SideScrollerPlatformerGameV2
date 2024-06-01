//preload scene

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload(){
        //overall
        this.load.audio('clickSFX','assets/audio/sfx/clickSFX.mp3');
        this.load.audio('hoverSFX','assets/audio/sfx/hoverSFX.mp3');
        //menu scene
        this.load.image('titleBG','./assets/images/titleBG.png');
        this.load.image('neck','./assets/images/neck.png');
        this.load.image('launch','./assets/images/buttons/launch.png');
        this.load.image('about','./assets/images/buttons/about.png');
        this.load.image('exit','./assets/images/buttons/exit.png');
        this.load.audio('menuBG','assets/audio/bgm/menuBG.mp3');
        //credits scene
        this.load.image('credBG','./assets/images/credBG.png');
        this.load.image('back','./assets/images/buttons/back.png');
        //game scene 1
        this.load.audio('gameBG','./assets/audio/bgm/gameBG.mp3');
        this.load.image('forest','./assets/images/forest.png');
        this.load.audio('goldSFX','./assets/audio/sfx/goldSFX.mp3');
        this.load.audio('goldSFXback','./assets/audio/sfx/goldSFXback.mp3');
        //game tilemap 1
        this.load.image('tiles','./assets/images/tilemaps/tilemap1.png');
        this.load.tilemapTiledJSON('map','./assets/images/tilemaps/tilemap1.json');
        //game scene 2
        this.load.audio('game2BG','./assets/audio/bgm/game2BG.mp3');
        this.load.audio('guillSFX','./assets/audio/sfx/guillSFX.mp3');
        this.load.image('castle','./assets/images/castle.png');
        this.load.image('castle2','./assets/images/castle2.png');
        this.load.image('guill','./assets/images/guill.png');
        this.load.image('deathceiling','./assets/images/deathceiling.png');
        this.load.audio('chaseBG','./assets/audio/bgm/chaseBG.mp3');
        this.load.image('black','./assets/images/black.png');
        //game tilemap 2
        this.load.image('tiles2','./assets/images/tilemaps/tilemap2.png');
        this.load.tilemapTiledJSON('map2','./assets/images/tilemaps/tilemap2.json');
        //game scene 3
        this.load.image('forest2','./assets/images/forest2.png');
        this.load.image('castlesun','./assets/images/castlesun.png');
        this.load.image('castlesun2','./assets/images/castlesun2.png');
        this.load.audio('destructionSFX','assets/audio/sfx/destructionSFX.mp3');
        this.load.audio('goldSFXloud','./assets/audio/sfx/goldSFXloud.mp3');
        this.load.audio('game3BG','./assets/audio/bgm/game3BG.mp3');
        this.load.audio('finalBG','./assets/audio/bgm/finalBG.mp3');
        this.load.image('debris', './assets/images/debris.png');
        this.load.audio('stompSFX','./assets/audio/sfx/stompSFX.mp3');
        this.load.image('warning', './assets/images/warning.png');
        this.load.image('exitrays', './assets/images/exit.png');
        //game tilemap 3
        this.load.image('tiles3','./assets/images/tilemaps/tilemap3.png');
        this.load.tilemapTiledJSON('map3','./assets/images/tilemaps/tilemap3.json');
        //game scene-player and mobs
        this.load.spritesheet('mushy',
            './assets/images/mushy.png',
            { frameWidth: 32, frameHeight: 48 }
        );
        this.load.spritesheet('laios',
            './assets/images/laiozz.png',
            { frameWidth: 32, frameHeight: 72 }
        );
        this.load.audio('stepSFX','./assets/audio/sfx/stepSFX.mp3');
        this.load.audio('jumpSFX','./assets/audio/sfx/jumpSFX.mp3');
        this.load.audio('gemSFX','./assets/audio/sfx/gemSFX.wav');
        this.load.audio('shroomSFX','./assets/audio/sfx/shroomSFX.mp3');
        //game over scene
        this.load.audio('deathBG','assets/audio/bgm/deathBG.mp3');
        this.load.image('gameover', './assets/images/gameover.png');
        this.load.image('retry','./assets/images/buttons/retry.png');
        this.load.image('stepback','./assets/images/buttons/stepback.png');
        //game win scene
        this.load.audio('winBG','assets/audio/bgm/winBG.mp3');
        this.load.image('gamewin', './assets/images/gamewin.png');
        this.load.image('retryblue','./assets/images/buttons/retryblue.png');
        this.load.image('stepbackblue','./assets/images/buttons/stepbackblue.png');
        this.load.image('proceedblue','./assets/images/buttons/proceedblue.png');
        //game over scene 2
        this.load.image('gameover2', './assets/images/gameover2.png');
        this.load.image('retry2','./assets/images/buttons/retry2.png');
        this.load.image('stepback2','./assets/images/buttons/stepback2.png');
        //game win scene 2
        this.load.audio('winBG2','assets/audio/bgm/winBG2.mp3');
        this.load.image('gamewin2', './assets/images/gamewin2.png');
        this.load.image('retryblue2','./assets/images/buttons/retryblue2.png');
        this.load.image('stepbackblue2','./assets/images/buttons/stepbackblue2.png');
        this.load.image('proceedblue2','./assets/images/buttons/proceedblue2.png');
        //game over scene 3
        this.load.image('gameover3','assets/images/gameover3.png');
        this.load.image('retry3','./assets/images/buttons/retry3.png');
        this.load.image('stepback3','./assets/images/buttons/stepback3.png');
        //game win scene 3
        this.load.audio('winBG3','assets/audio/bgm/winBG3.mp3');
        this.load.image('gamewin3', './assets/images/gamewin3.png');
        this.load.image('retryblue3','./assets/images/buttons/retryblue3.png');
        this.load.image('stepbackblue3','./assets/images/buttons/stepbackblue3.png');
    }

    create() {      //loading screen, transitions to Main Menu after the preloading
        this.loadingText = this.add.text(750, 360, 'Lunging into the dungeon...', { 
            fontSize: '85px', 
            fill: '#f4cfaf', 
            stroke: '#863e45',
            strokeThickness: 20, 
            fontFamily: 'Yoster'
        }).setOrigin(0.5).setAlpha(1);

        this.time.delayedCall(2000, () => {
            this.loadingText.setAlpha(0);
        }, [], this);

        this.time.delayedCall(3000, () => {
            this.loadingText.destroy();
            this.scene.start('MainMenuScene');
        }, [], this);
    }
}