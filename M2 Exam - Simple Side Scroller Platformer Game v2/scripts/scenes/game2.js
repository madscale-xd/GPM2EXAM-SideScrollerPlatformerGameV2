//level 2

export default class GameScene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene2' });
        this.score = 0;
        this.gems = 0;
        this.lives = 0;
        this.scoreText;
        this.gemText;
        this.seconds = 0;
        this.playerVelocity = 130;
        this.tileCooldowns = {};
        this.blackenInterval = 1000; 
    }

    create(data) {
        //reset and setup stats
        this.score = data.score;
        this.gems = data.gems;
        this.lives = 0;

        //music
        this.gameMusic = this.sound.add('game2BG', { volume: 1.2, loop: true });
        this.gameMusic.play();
        this.chaseMusic = this.sound.add('chaseBG', { volume: 0.8, loop: true });
        //sfx
        this.stepSFX = this.sound.add('stepSFX', { volume: 0.8, loop: true });
        this.jumpSFX = this.sound.add('jumpSFX', { volume: 0.25});
        this.gemSFX = this.sound.add('gemSFX', { volume: 0.8});
        this.shroomSFX = this.sound.add('shroomSFX', { volume: 0.6});
        this.goldSFX = this.sound.add('goldSFX', { volume: 1.3});
        this.goldSFXback = this.sound.add('goldSFXback', { volume: 1.3});
        this.guillSFX = this.sound.add('guillSFX', { volume: 1.3});

        //backgrounds
        this.add.image(-400, -250, 'castle').setScale(2).setOrigin(0).setTint(0x495054);
        this.add.image(1760, -250,'castle2').setScale(2).setOrigin(0).setTint(0x495054);
        this.add.image(3920, -250,'castle').setScale(2).setOrigin(0).setTint(0x495054);

        //map and tiles (loaded through JSON)
        this.map2 = this.make.tilemap({key:"map2", tileWidth:32, tileHeight:32});
        this.tileset2 = this.map2.addTilesetImage("tilemap2","tiles2");
        this.layer2 = this.map2.createLayer("dPlatforms",this.tileset2,0,0);
        this.layer4 = this.map2.createLayer("wallDesigns",this.tileset2,0,0);
        this.layer6 = this.map2.createLayer("danger",this.tileset2,0,0);
        this.layer7 = this.map2.createLayer("winGame",this.tileset2,0,0);

        //player
        this.player = this.physics.add.sprite(475, 420, 'mushy').setScale(1);      //original 475, 420 (notes for testing spawn areas)
        this.player.setBounce(0.2);
       
        //layers AFTER the player
        this.layer1 = this.map2.createLayer("inDungeon",this.tileset2,0,0);
        this.layer5 = this.map2.createLayer("frontDesigns",this.tileset2,0,0);
        this.black = this.add.image(0,0, 'black').setOrigin(0);

        //UNIQUE objects
        this.guill1 = this.physics.add.image(2016, 160, 'guill').setOrigin(0);      //guillotines
        this.guill1.body.setAllowGravity(false);
        this.guill2 = this.physics.add.image(2208, 160, 'guill').setOrigin(0);
        this.guill2.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.guill1, this.playerDieObj, null, this);
        this.physics.add.overlap(this.player, this.guill2, this.playerDieObj, null, this);
        this.guill1Triggered = false;
        this.guill2Triggered = false;

        this.deathCeiling = this.physics.add.image(3264, -384, 'deathceiling').setOrigin(0);    //trap near the end of the stage
        this.deathCeiling.body.setAllowGravity(false);
        this.physics.add.overlap(this.player, this.deathCeiling, this.playerDieObj, null, this);
        this.deathCeilingTriggered = false;

        this.blackContainer = this.add.container(0,0);      //screen that slowly goes to black
        this.blackContainer.add(this.black);
        this.blackContainer.setScrollFactor(0);
        this.black.alpha = 0.1;
        this.layer3 = this.map2.createLayer("light",this.tileset2,0,0);

        //controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('mushy', { start: 0, end: 3 }),
            frameRate: 12,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'mushy', frame: 4 }],
            frameRate: 6
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('mushy', { start: 5, end: 8 }),
            frameRate: 12,
            repeat: -1
        });

        //tilemap-based collisions
        this.layer1.setCollisionBetween(0, 2);  //inDungeon
        this.physics.add.collider(this.player, this.layer1);
        this.layer2.setCollisionBetween(0, 99); //dPlatforms
        this.physics.add.collider(this.player, this.layer2, this.destroyWood, null, this);
        this.layer3.setCollisionBetween(69,71); //light     (counteracts the gradual blackening of the screen)
        this.physics.add.overlap(this.player, this.layer3, this.collectLight, null, this);
        this.layer6.setCollisionBetween(0, 99); //danger    (kills you)
        this.physics.add.collider(this.player, this.layer6, this.playerDie, null, this);
        this.layer7.setCollisionBetween(59, 61);
        this.physics.add.overlap(this.player, this.layer7, this.winGame, null, this);

        //camera (follows the player, given an offset and a zoom for aesthetic and technical purposes)
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(-25, 40);
        this.cameras.main.setZoom(2);

        //score and gems and UI and the slow fade to black
        this.scoreText = this.add.text(340, 160, 'Score: '+this.score, { fontFamily: 'Yoster', fontSize: 20,  
        fill: '#f4cfaf', 
        stroke: '#863e45',
        strokeThickness: 4}).setOrigin(0);
        this.gemText = this.add.text(340, 190, 'Gems Collected: '+this.gems, { fontFamily: 'Yoster', fontSize: 20, 
        fill: '#f4cfaf', 
        stroke: '#863e45',
        strokeThickness: 4, }).setOrigin(0);

        this.uiContainer = this.add.container(50, 50);
        this.uiContainer.add(this.scoreText);
        this.uiContainer.add(this.gemText);
        this.uiContainer.setScrollFactor(0);

        this.blackAlpha = this.time.addEvent({
            delay: this.blackenInterval,
            callback: this.blacken,
            callbackScope: this,
            loop: true
        });
    }

    update (time)
    //player movement, conditional checks (defeat), and trap triggers
    {
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-(this.playerVelocity));
            this.player.anims.play('left', true);
            if (!this.stepSFX.isPlaying) {
                this.stepSFX.play();
            }
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(this.playerVelocity);
            this.player.anims.play('right', true);
            if (!this.stepSFX.isPlaying) {
                this.stepSFX.play();
            }
        }
        else
        {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
            this.stepSFX.stop();
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.setVelocityY(-355);
            this.jumpSFX.play();
        }
        if (this.player.y >= 1150){     // LOSE CONDITION (FALLING)
            this.scene.pause();
            this.scene.start('GameOverScene2', {score: this.score, gems: this.gems});    //use data obj to give info to other scenes
        }
        if (this.player.x >= 2012 && !this.guill1Triggered) {            //guillotine 1 trigger (ensures one-time activation)
            this.guillSFX.play();
            this.guill1Triggered = true;
        }
        if (this.player.x >= 2202 && !this.guill2Triggered) {            //guillotine 2 trigger (ensures one-time activation)
            this.guillSFX.play();
            this.guill2Triggered = true;
        }
        if (this.guill1Triggered) {                                      //guillotine 1 actual movement
            this.guill1.y += 2.3;     
        }
        if (this.guill2Triggered) {                                      //guillotine 2 actual movement
            this.guill2.y += 2.3;
        }
        if (this.player.x >= 3600 && !this.deathCeilingTriggered) {      //death ceiling trigger (ensures one-time activation)
            this.gameMusic.stop();
            this.chaseMusic.play();
            this.deathCeilingTriggered = true;
        }
        if(this.deathCeilingTriggered){                                  //death ceiling actual movement
            this.deathCeiling.y += 0.195;
        }
    }

    collectLight(player, tile){           //points collection and light retention system
        const lightIndices = [1,2,3];
        if(lightIndices.includes(tile.index)){
            this.layer3.removeTileAt(tile.x, tile.y);
            this.gems+=1;
            this.score+=20;
            this.black.alpha = 0;
            this.scoreText.setText('Score: ' + this.score);
            this.gemText.setText('Gems Collected: ' + this.gems);
            this.gemSFX.play();
        }
    }

    playerDie(player, tile){                                    //death caused by tiles in DANGER layer
        const tileIndices2 = [92,93,94,95,96,97,98,99,100];
        if(tileIndices2.includes(tile.index)){
            this.scene.pause();
            this.scene.start('GameOverScene2', {score: this.score, gems: this.gems});    //use data obj to give info to other scenes
        }
    }

    playerDieObj(player, object){                               //death caused by UNIQUE objects
        this.scene.pause();
        this.scene.start('GameOverScene2', {score: this.score, gems: this.gems});
    }

    destroyWood(player, tile) {     //reappearing woods of the moon
        if(tile.index === 11){
        const tileX = tile.x;
        const tileY = tile.y;
        const tileKey = `${tileX},${tileY}`;
        const currentTime = this.time.now;
        if (!this.tileCooldowns[tileKey] || (currentTime - this.tileCooldowns[tileKey] > 500)) {    //SFX management
            this.tileCooldowns[tileKey] = currentTime;  //makes it so goldSFX does NOT repeatedly play on the same tile before vanishing
            this.time.delayedCall(500, () => {
                this.layer2.removeTileAt(tileX, tileY);
                this.goldSFX.play();
                this.time.delayedCall(1000, () => {
                    this.layer2.putTileAt(tile.index, tileX, tileY);
                    this.goldSFXback.play();
                }, [], this);
            }, [], this);
        }
        }
    }
    blacken(){
        if (this.black.alpha <= 1) {
            this.black.alpha += 0.05; 
        }
    }
    winGame(player, tile){      //WIN CONDITION (GET TO THE OTHER DUNGEON'S DOOR)
        if(tile.index===61){
            this.scene.pause();
            this.scene.start('GameWinScene2', {score: this.score, gems: this.gems}); //use data obj to give info to other scenes
        }
    }
}