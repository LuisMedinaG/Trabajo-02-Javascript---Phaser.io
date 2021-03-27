var config = {
    type: Phaser.AUTO,
    width: 860,
    height: 680,
    backgroundColor: '#87ceff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 650 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};


var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var wals;
var coins;
var enemies;

var level = [
    'xxxxxxxxxxxxxxxxxxxxxxxxx',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'x                       x',
    'xxxxxxxxxxxxxxxxxxxxxxxxx',
];

var game = new Phaser.Game(config);

function preload() {
    this.load.image('wall', 'assets/wall.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('coin', 'assets/coin.png');

    // this.load.image('ground', 'assets/platform.png');
    // this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    this.load.spritesheet('dude',
        'assets/dudes.png',
        { frameWidth: 11, frameHeight: 15 }
    );
}

function create() {
    platforms = this.physics.add.staticGroup();

    // ================================================================================
    walls = this.physics.add.staticGroup();
    coins = this.physics.add.staticGroup();
    enemies = this.physics.add.staticGroup();

    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {

            // Create a wall and add it to the 'walls' group
            if (level[i][j] == 'x') {
                walls.create(32 + 32 * j, 32 + 32 * i, 'wall').setScale(0.5).refreshBody();
            }

            // Create a coin and add it to the 'coins' group
            else if (level[i][j] == 'o') {
                var coin = game.add.sprite(30 + 20 * j, 30 + 20 * i, 'coin');
                coins.add(coin);
            }

            // Create a enemy and add it to the 'enemies' group
            else if (level[i][j] == '!') {
                var enemy = game.add.sprite(30 + 20 * j, 30 + 20 * i, 'bomb');
                enemies.add(enemy);
            }
        }
    }

    // ================================================================================

    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    // movingPlatform = this.physics.add.image(400, 400, 'ground');

    // movingPlatform.setImmovable(true);
    // movingPlatform.body.allowGravity = false;
    // movingPlatform.setVelocityX(50);

    player = this.physics.add.sprite(32 * 3.5, 32 * 15, 'dude');

    // player.setBounce(0.1);
    // player.setCollideWorldBounds(true);
    // player.setGravityY(500);

    // this.anims.create({
    //     key: 'left',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // this.anims.create({
    //     key: 'turn',
    //     frames: [{ key: 'dude', frame: 2 }],
    //     frameRate: 20
    // });

    // this.anims.create({
    //     key: 'right',
    //     frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 4 }),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // cursors = this.input.keyboard.createCursorKeys();

    // stars = this.physics.add.group({
    //     key: 'star',
    //     repeat: 10,
    //     setXY: { x: 12, y: 0, stepX: 70 }
    // });

    // stars.children.iterate(function (child) {

    //     child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    // });

    // scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // bombs = this.physics.add.group();

    // this.physics.add.collider(player, platforms);
    // this.physics.add.collider(player, movingPlatform);
    // this.physics.add.collider(stars, platforms);
    // this.physics.add.collider(stars, movingPlatform);
    // this.physics.add.collider(bombs, platforms);

    // this.physics.add.overlap(player, stars, collectStar, null, this);

    // this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    // if (gameOver) {
    //     return;
    // }

    // if (cursors.left.isDown) {
    //     player.setVelocityX(-330);

    //     player.anims.play('left', true);
    // }
    // else if (cursors.right.isDown) {
    //     player.setVelocityX(330);

    //     player.anims.play('right', true);
    // }
    // else {
    //     player.setVelocityX(0);

    //     player.anims.play('turn');
    // }

    // if (cursors.up.isDown && player.body.touching.down) {
    //     player.setVelocityY(-650);
    // }

    // if (movingPlatform.x >= 500) {
    //     movingPlatform.setVelocityX(-60);
    // }
    // else if (movingPlatform.x <= 300) {
    //     movingPlatform.setVelocityX(60);
    // }
}

function collectStar(player, star) {
    star.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    console.log("Logging test");
    if (stars.countActive(true) === 0) {
        console.log("No stars");
        //  A new batch of stars to collect
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}
