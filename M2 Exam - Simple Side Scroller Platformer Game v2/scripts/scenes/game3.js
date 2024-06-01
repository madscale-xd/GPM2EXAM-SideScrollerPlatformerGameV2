//level 2

export default class GameScene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene3' });
        this.score = 0;
        this.gems = 0;
        this.lives = 0;
        this.scoreText;
        this.gemText;
        this.seconds = 0;
        this.playerVelocity = 130;
        this.tileCooldowns = {};
        this.spawnInterval = 2500; 
        this.controlsEnabled = true;
        this.cutsceneTriggered = false;
    }

    create(data) {
        //reset and setup stats
        this.score = data.score;
        this.gems = data.gems;
        this.cutsceneTriggered = false;
        this.destructionSFXPlayed = false;
        this.goldSFXloudPlayed = false;
        this.lives = 0;

        //music
        this.gameMusic = this.sound.add('game3BG', { volume: 0.8, loop: true });
        this.gameMusic.play();
        this.finalMusic = this.sound.add('finalBG', { volume: 0.8, loop: true });

        //sfx
        this.stepSFX = this.sound.add('stepSFX', { volume: 0.8, loop: true });
        this.jumpSFX = this.sound.add('jumpSFX', { volume: 0.25});
        this.gemSFX = this.sound.add('gemSFX', { volume: 0.8});
        this.shroomSFX = this.sound.add('shroomSFX', { volume: 0.6});
        this.goldSFX = this.sound.add('goldSFX', { volume: 1.3});
        this.goldSFXloud = this.sound.add('goldSFXloud', { volume: 1.6});
        this.goldSFXback = this.sound.add('goldSFXback', { volume: 1.3});
        this.guillSFX = this.sound.add('guillSFX', { volume: 1.3});
        this.destructionSFX = this.sound.add('destructionSFX', { volume: 0.3});
        this.stompSFX = this.sound.add('stompSFX', { volume: 0.8, loop: true });

        //backgrounds
        this.add.image(-400, -250, 'castlesun').setScale(2).setOrigin(0).setTint(0xcfb4a1);
        this.add.image(1760, -250,'castlesun2').setScale(2).setOrigin(0).setTint(0xcfb4a1);
        this.add.image(3920, -250,'forest2').setScale(2).setOrigin(0).setTint(0xcfb4a1);
        this.add.image(4680, 228, 'exitrays').setScale(2.5);

        //map and tiles (loaded through JSON)
        this.map3 = this.make.tilemap({key:"map3", tileWidth:32, tileHeight:32});
        this.tileset3 = this.map3.addTilesetImage("tilemap3","tiles3");
        this.layer2 = this.map3.createLayer("platforms1",this.tileset3,0,0).setTint(0x7a685b);
        this.layer3 = this.map3.createLayer("gems",this.tileset3,0,0);
        this.layer4 = this.map3.createLayer("danger",this.tileset3,0,0).setTint(0x7a685b);
        this.layer5 = this.map3.createLayer("special",this.tileset3,0,0).setTint(0x7a685b);
        this.layer6 = this.map3.createLayer("platforms2",this.tileset3,0,0).setTint(0x7a685b);
        this.layer9 = this.map3.createLayer("win",this.tileset3,0,0).setTint(0x7a685b);

        //player
        this.player = this.physics.add.sprite(475, 975, 'mushy').setScale(1).setTint(0xc7b3a5);      //original 475, 975 (580, 500) (1120, 975) (notes for testing spawn areas)
        this.player.setBounce(0.2);

        //debris group
        this.debrizz = this.physics.add.group({
            defaultKey: 'debris',
            maxSize: 100, 
        });
       
        //layers AFTER the player
        this.layer1 = this.map3.createLayer("dungeon",this.tileset3,0,0).setTint(0x7a685b);
        this.layer7 = this.map3.createLayer("designs",this.tileset3,0,0).setTint(0x7a685b);
        this.layer7.setPosition(15, 0);
        this.layer8 = this.map3.createLayer("designs2",this.tileset3,0,0).setTint(0x7a685b);

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
        this.layer1.setCollisionBetween(0, 2);  //dungeon
        this.physics.add.collider(this.player, this.layer1);
        this.layer2.setCollisionBetween(0, 100);  //platforms1 (before destruction cutscene)
        this.collider1 = this.physics.add.collider(this.player, this.layer2, this.destroyWood, null, this);
        this.layer3.setCollisionBetween(0, 6); //gems
        this.physics.add.overlap(this.player, this.layer3, this.collectGem, null, this);
        this.layer4.setCollisionBetween(0, 100); //danger   (kills you)
        this.physics.add.collider(this.player, this.layer4, this.playerDie, null, this);
        this.layer5.setCollisionBetween(0,100);    //special (triggers cutscene)
        this.collider2 = this.physics.add.collider(this.player, this.layer5, this.cutscene, null, this);
        this.layer6.setCollisionBetween(0,100);     //platforms2 (after destruction cutscene)
        this.collider3 = this.physics.add.collider(this.player, this.layer6, this.destroyWood2, null, this);
        this.layer9.setCollisionBetween(59, 61);    //win layer!
        this.physics.add.overlap(this.player, this.layer9, this.winGame, null, this);

        this.layer6.setVisible(false);      //appears after cutscene
        this.collider3.active = false;

        //camera (follows the player, given an offset and a zoom for aesthetic and technical purposes)
        this.cameras.main.startFollow(this.player);
        this.cameras.main.followOffset.set(-25, 40);
        this.cameras.main.setZoom(2);               

        //score and gems and UI
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

        //timers for debris spawning and stomp effect intervals
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnInterval,
            callback:() => this.spawnDebris(this.player.x),
            callbackScope: this,
            loop: true
        });

        this.stompTimer = this.time.addEvent({
            delay: 1000,
            callback:() => this.stompy(),
            callbackScope: this,
            loop: true
        });

        //GIANT Laios who chases Mushy down
        this.isOverlapping = false;
        this.overlapStartTime = 0;
        
        this.laios = this.physics.add.sprite(0, 480, 'laios').setScale(20);
        this.laios.body.setAllowGravity(false);
        this.laios.setVisible(false);

        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('laios', { start: 0, end: 3}),
            frameRate: 1,
            repeat: -1
        });

        this.laios.play('walk');

    }

    update (time)
    //player movement and conditional checks (defeat)
    {
        if (this.controlsEnabled) {
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
        }
        if (this.player.y >= 1150){     // LOSE CONDITION (FALLING)
            console.log('fall');
            this.scene.pause();
            this.scene.start('GameOverScene3', {score: this.score, gems: this.gems});    //use data obj to give info to other scenes
        }
        //debris stuff, iterating proper destruction through children to save memory
        this.debrizz.children.each(function (debris) {
            if(debris.active && debris.y > 1800){
                debris.destroy();
            }
        }, this);
        this.physics.add.overlap(this.player, this.debrizz, this.handlePlayerCollision, null, this);    //death by debris
        this.physics.add.overlap(this.player, this.laios, this.startOverlap, null, this);      //death by Laios
        if (this.isOverlapping) {                                       //3 seconds leeway before death by Laios
            if (time >= this.overlapStartTime + 3000) {
                this.handlePlayerCollision2();
                this.isOverlapping = false; 
            }
        } else {
            this.overlapStartTime = 0;
        }
    }

    collectGem(player, tile){           //points collection system
        const gemIndices = [1,2,3,4,5,6];
        if(gemIndices.includes(tile.index)){
            this.layer3.removeTileAt(tile.x, tile.y);
            this.gems+=1;
            this.score+=20;
            this.scoreText.setText('Score: ' + this.score);
            this.gemText.setText('Gems Collected: ' + this.gems);
            this.gemSFX.play();
        }
    }

    destroyWood(player, tile) {     //reappearing woods 
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
                    const placedTile = this.layer2.getTileAt(tileX, tileY);
                    placedTile.tint = 0x7a685b;
                    this.goldSFXback.play();
                }, [], this);
            }, [], this);
        }
        }
    }

    destroyWood2(player, tile) {     //reappearing woods part two, after destruction
        if(tile.index === 11){
        const tileX = tile.x;
        const tileY = tile.y;
        const tileKey = `${tileX},${tileY}`;
        const currentTime = this.time.now;
        if (!this.tileCooldowns[tileKey] || (currentTime - this.tileCooldowns[tileKey] > 500)) {    //SFX management
            this.tileCooldowns[tileKey] = currentTime;  //makes it so goldSFX does NOT repeatedly play on the same tile before vanishing
            this.time.delayedCall(500, () => {
                this.layer6.removeTileAt(tileX, tileY);
                this.goldSFX.play();
                this.time.delayedCall(1000, () => {
                    this.layer6.putTileAt(tile.index, tileX, tileY);
                    const placedTile = this.layer6.getTileAt(tileX, tileY);
                    placedTile.tint = 0x7a685b;
                    this.goldSFXback.play();
                }, [], this);
            }, [], this);
        }
        }
    }

    playerDie(player, tile){                                        //death caused by tiles in DANGER layer
        const tileIndices2 = [91,92,93,94,95,96,97,98,99,100];
        if(tileIndices2.includes(tile.index)){
            console.log('danger');
            this.scene.pause();
            this.scene.start('GameOverScene3', {score: this.score, gems: this.gems});    //use data obj to give info to other scenes
        }
    }

    cutscene(){    //plays out a set of events that collectively feels like a cutscene that formally starts the level with its gimmicks
        if (!this.destructionSFXPlayed) {
            this.destructionSFX.play();
            this.destructionSFXPlayed = true;
        }
        const camera = this.cameras.main;
        camera.shake(8000, 0.002);
        this.controlsEnabled = false;
        this.gameMusic.stop();
        this.time.delayedCall(8000, () => {
            this.cutsceneTriggered = true;
            this.controlsEnabled = true;
            this.layer5.setVisible(false);
            this.physics.world.removeCollider(this.collider1);
            this.physics.world.removeCollider(this.collider2);
            this.layer2.setVisible(false);
            this.layer6.setVisible(true);      //appears after cutscene
            this.collider3.active = true;      //layer 6
            this.laios.setVisible(true);
            this.laios.setVelocityX(55);
            if (!this.goldSFXloudPlayed) {
                this.goldSFXloud.play();
                this.finalMusic.play();
                this.goldSFXloudPlayed = true;
            }
        })
    }

    spawnDebris(playerX) {                          //debris spawner
        if (this.cutsceneTriggered === false){              //ensures nothing happens when this method is called before cutscene

        }
        else if (this.cutsceneTriggered === true) {      //"activates" method after cutscene (works like DD's Prophet's Prognosticate move)
            const range = 280; 
            const x = Phaser.Math.Between(playerX - range, playerX + range); 
            const size = Phaser.Math.Between(1, 1.5);
            const speed = Phaser.Math.Between(125, 175);
    
            // Create the warning sign at the current player's Y position minus an offset to show where debris drops
            const warningSign = this.add.image(x, this.player.y - 400, 'warning');
            warningSign.setScale(size); 
            warningSign.setOrigin(0.5, 0.5); 
    
            // Ensures the warning sign is visible long enough before the debris falls
            this.time.delayedCall(1500, () => {
                // Create the debris after the warning sign is shown
                const debris = this.debrizz.get(x, this.player.y - 250);  // Fixed position based on the player's Y-coordinate at call time
                if (debris) {
                    debris.setActive(true);
                    debris.setVisible(true);
                    debris.setVelocityY(speed);
                    debris.setScale(size);
                    debris.setTint(0x7a685b);
                    debris.body.allowGravity = false;
                    const rotateX = Math.random() < 0.5; // Random boolean for X axis rotation
                    const rotateY = Math.random() < 0.5; // Random boolean for Y axis rotation
    
                    if (rotateX) {
                        debris.setFlipX(true); // Randomly flip on X axis
                    }
    
                    if (rotateY) {
                        debris.setFlipY(true); // Randomly flip on Y axis
                    }
                }
                // Destroy the warning sign after the debris has started falling
                warningSign.destroy();
            });
        }
    }

    handlePlayerCollision(player, debris) {                         //handles death by debris
        console.log('debris');
        if(debris.setVisible(true) && debris.setActive(true)){
            debris.destroy();
            this.scene.pause();
            this.scene.start('GameOverScene3', {score: this.score, gems: this.gems});
        }
    }

    handlePlayerCollision2(player, laios) {                         //handles death after 3 seconds in Laios hitbox
        console.log('laios');
        this.laios.destroy();
        this.scene.pause();
        this.scene.start('GameOverScene3', {score: this.score, gems: this.gems});
    }

    startOverlap() {
        if (!this.isOverlapping) {
            this.isOverlapping = true;
            this.overlapStartTime = this.time.now;  //more Laios 3 seconds rule stuff
        }
    }

    stompy(){                                   //looping trigger for GIANT LAIOS stomp effects (SFX + screen shake)
        if(this.cutsceneTriggered === true){
            if (!this.stompSFX.isPlaying) {
                this.stompSFX.play();
            }
            const camera = this.cameras.main;
            camera.shake(500, 0.001);
        }
    }

    winGame(player, tile){      //WIN CONDITION (GET TO FREEEDOOOOMMMMMMMMMMMM!!!!)
        if(tile.index===61){
            console.log(this.player.x, this.player.y);
            this.scene.pause();
            this.scene.start('GameWinScene3', {score: this.score, gems: this.gems}); //use data obj to give info to other scenes
        }
    }
}