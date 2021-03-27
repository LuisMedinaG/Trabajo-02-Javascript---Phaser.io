const gravity = 1400;
const jumpForce = 500;
const playerSpeed = 350;

var config = {
    type: Phaser.AUTO,
    width: 860,
    height: 680,
    backgroundColor: '#87ceff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gravity },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var lives;
var player;
var bombs;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var scoreLives;

var total = 100;

var walls;
var coins;
var spikes;

var level = [
    'xxxxxxxxxxxxxxxxxxxxxxxxxx',
    'x  o                     x',
    'x  xxx    o   xxxx!xxxx! x',
    'x     x   x       !      x',
    'xo                !     xx',
    'xx    o                  x',
    'x     x                 xx',
    'xx          o    !   o ! x',
    'xo         xxx       x   x',
    'xx  !!  !!       o       x',
    'x                x       x',
    'xx                       x',
    'xo         o             x',
    'xxxxx     xxx !!! xx     x',
    'x      !             x   x',
    'x  o                 !   x',
    'x xxx                   xx',
    'x        !      o   xxx !x',
    'x  o  !  o  !  xxx!  o  !x',
    'xxxxxxxxxxxxxxxxxxxxxxxxxx',
];

var game = new Phaser.Game(config);

function createLevel() {
    for (var i = 0; i < level.length; i++) {
        for (var j = 0; j < level[i].length; j++) {
            if (level[i][j] == 'x') {
                walls.create(32 + 32 * j, 32 + 32 * i, 'wall').setScale(0.5).refreshBody();
            } else if (level[i][j] == 'o') {
                coins.create(32 + 32 * j, 32 + 32 * i - 15, 'coin').setScale(0.5);
            } else if (level[i][j] == '!') {
                spikes.create(32 + 32 * j, 32 + 32 * i, 'enemy').setScale(0.5).refreshBody();
            }
        }
    }
}

function preload() {
    this.load.image('wall', 'assets/wall.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dudes.png',
        { frameWidth: 11, frameHeight: 15 }
    );
}


function create() {
    lives = 3;
    score = 0;

    walls = this.physics.add.staticGroup();
    spikes = this.physics.add.staticGroup();

    coins = this.physics.add.group();
    bombs = this.physics.add.group();

    createLevel();

    player = this.physics.add.sprite(54, 32 * 18, 'dude');

    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 2 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(24, 24, 'Score: 0', { fontSize: '16px', fill: '#000' });
    scoreLives = this.add.text(124, 24, 'Lives: 0', { fontSize: '16px', fill: '#000' });
    scoreLives.setText('Lives: ' + lives);

    this.physics.add.collider(player, walls);
    this.physics.add.collider(coins, walls);
    this.physics.add.collider(bombs, walls);

    this.physics.add.collider(player, coins, collectCoin, null, this);
    this.physics.add.collider(player, spikes, hitBomb, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-playerSpeed);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(playerSpeed);

        player.anims.play('right', true);
    }
    else {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-jumpForce);
    }
}

function collectCoin(player, coin) {
    coin.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (coins.countActive(true) === 0) {
        coins.children.iterate(function (child) {
            child.enableBody(true, child.x, child.y - 20, true, true);
        });

        var x = Phaser.Math.Between(54, 626);

        var bomb = bombs.create(x, 54, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    if (lives === 0) {
        this.physics.pause();
        player.setTint(0xff0000);

        this.registry.destroy();
        this.events.off();
        this.scene.restart();
    } else {
        lives--;
        scoreLives.setText('Lives: ' + lives);
    }
}