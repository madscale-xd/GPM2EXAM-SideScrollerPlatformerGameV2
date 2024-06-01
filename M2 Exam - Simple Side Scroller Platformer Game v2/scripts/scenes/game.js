//level 1

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.gems = 0;
        this.lives = 0;
        this.scoreText;
        this.gemText;
        this.seconds = 0;
        this.playerVelocity = 130;
        this.tileCooldowns = {};
    }

    create() {
        //reset stats
        this.score = 0;
        this.gems = 0;
        this.lives = 0;
        
        //music
        this.gameMusic = this.sound.add('gameBG', { volume: 0.7, loop: true });
        this.gameMusic.play();

        //sfx
        this.stepSFX = this.sound.add('stepSFX', { volume: 0.8, loop: true });
        this.jumpSFX = this.sound.add('jumpSFX', { volume: 0.25});
        this.gemSFX = this.sound.add('gemSFX', { volume: 0.8});
        this.shroomSFX = this.sound.add('shroomSFX', { volume: 0.6});
        this.goldSFX = this.sound.add('goldSFX', { volume: 1.3});
        this.goldSFXback = this.sound.add('goldSFXback', { volume: 1.3});

        //backgrounds
        this.add.image(-400, -250, 'forest').setScale(2).setOrigin(0);
        this.add.image(1760, -250,'forest').setScale(2).setOrigin(0);
        this.add.image(3920, -250,'forest').setScale(2).setOrigin(0);
        
        //player
        this.player = this.physics.add.sprite(475, 420, 'mushy').setScale(1);      //original 475, 420 (notes for testing spawn areas)
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player.setBounce(0.2);

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

        //map and tiles (loaded through JSON)
        this.map = this.make.tilemap({key:"map", tileWidth:32, tileHeight:32});
        this.tileset = this.map.addTilesetImage("tilemap1","tiles");
        this.layer2 = this.map.createLayer("platforms",this.tileset,0,0);
        this.layer3 = this.map.createLayer("mushroom",this.tileset,0,0);
        this.layer4 = this.map.createLayer("golds",this.tileset,0,0);
        this.layer5 = this.map.createLayer("gems",this.tileset,0,0);
        this.layer6 = this.map.createLayer("win",this.tileset,0,0);
        this.layer1 = this.map.createLayer("castleBridge",this.tileset,0,0);

        //tilemap-based collisions
        this.layer1.setCollisionBetween(0, 62);
        this.physics.add.collider(this.player, this.layer1);
        this.layer2.setCollisionBetween(0, 62);
        this.physics.add.collider(this.player, this.layer2);
        this.layer3.setCollisionBetween(69,71);
        this.physics.add.overlap(this.player, this.layer3, this.collectBrother, null, this);
        this.layer4.setCollisionBetween(58, 60);
        this.physics.add.collider(this.player, this.layer4, this.destroyGold, null, this);
        this.layer5.setCollisionBetween(75, 79);
        this.physics.add.overlap(this.player, this.layer5, this.collectGem, null, this);
        this.layer6.setCollisionBetween(75, 79);
        this.physics.add.overlap(this.player, this.layer6, this.winGame, null, this);
        

        //camera (follows the player, given an offset and a zoom for aesthetic and technical purposes)
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(-25, 40);
        this.cameras.main.setZoom(2);

        //score and gems and UI
        this.scoreText = this.add.text(340, 160, 'Score: 0', { fontFamily: 'Yoster', fontSize: 20,  
        fill: '#f4cfaf', 
        stroke: '#863e45',
        strokeThickness: 4}).setOrigin(0);
        this.gemText = this.add.text(340, 190, 'Gems Collected: 0', { fontFamily: 'Yoster', fontSize: 20, 
        fill: '#f4cfaf', 
        stroke: '#863e45',
        strokeThickness: 4, }).setOrigin(0);

        this.uiContainer = this.add.container(50, 50);
        this.uiContainer.add(this.scoreText);
        this.uiContainer.add(this.gemText);
        this.uiContainer.setScrollFactor(0);
    }

    update ()
    //player movement and conditional checks (defeat)
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
            this.player.setVelocityY(-350);
            this.jumpSFX.play();
        }
        if (this.player.y >= 1150){     // LOSE CONDITION (FALLING)
            this.scene.pause();
            this.scene.start('GameOverScene', {score: this.score, gems: this.gems});    //use data obj to give info to other scenes
        }
    }

    collectBrother(player, tile){       //SECRET points (and lives) collection system
        if(tile.index === 71){
            this.layer3.removeTileAt(tile.x, tile.y);
            this.lives+=1;
            this.score+=100;
            this.scoreText.setText('Score: ' + this.score);
            this.shroomSFX.play();
        }
    }

    collectGem(player, tile){           //points collection system
        const gemIndices = [75,76,77,78, 79]
        if(gemIndices.includes(tile.index)){
            this.layer5.removeTileAt(tile.x, tile.y);
            this.gems+=1;
            this.score+=20;
            this.scoreText.setText('Score: ' + this.score);
            this.gemText.setText('Gems Collected: ' + this.gems);
            this.gemSFX.play();
        }
    }

    destroyGold(player, tile) {     //gold blocks maze by the end of the stage
        const tileX = tile.x;
        const tileY = tile.y;
        const tileKey = `${tileX},${tileY}`;
        const currentTime = this.time.now;
        if (!this.tileCooldowns[tileKey] || (currentTime - this.tileCooldowns[tileKey] > 500)) {    //SFX management
            this.tileCooldowns[tileKey] = currentTime;  //makes it so goldSFX does NOT repeatedly play on the same tile before vanishing
            this.time.delayedCall(500, () => {
                this.layer4.removeTileAt(tileX, tileY);
                this.goldSFX.play();
                this.time.delayedCall(1000, () => {
                    this.layer4.putTileAt(tile.index, tileX, tileY);
                    this.goldSFXback.play();
                }, [], this);
            }, [], this);
        }
    }

    winGame(player, tile){      //WIN CONDITION (GET TO THE OTHER DUNGEON'S DOOR)
        if(tile.index===76){
            this.scene.pause();
            this.scene.start('GameWinScene', {score: this.score, gems: this.gems}); //use data obj to give info to other scenes
        }
    }
}