class TelaJogo extends Phaser.Scene {

    constructor() {
        super({
            key: 'TelaJogo',
        });
    }

    init() {
        // Inicialização de variáveis (exemplo)
        this.bg = {
            x_start: 0,
            x: 0,
            y: 0,
            x_end: -800,
            obj: null
        };

        this.cols = {
            speed: 60,
            space: 180,
            x: 500,
            min_x: 400,
            max_x: 800,
            y: -400,
            min_y: -500,
            max_y: -200,
            height: 600,
            width: 50,
            col1_obj: null,
            col2_obj: null
        };

        this.player = {
            width: 170,
            height: 133,
            obj: null
        };

        this.gameControls = {
            over: false,
            current_col_scored: false,
            score: 0
        };
    }

    preload() {
        // Carregamento de assets (exemplo)
        this.load.image('bg', 'assets/background.png');
        this.load.image('submarino', 'assets/submarino.png');
        this.load.image('submarinoVermelho', 'assets/submarinoVermelho.png');
        this.load.image('colBottom', 'assets/coluna_bottom.png');
        this.load.image('colUpper', 'assets/coluna_upper.png');
    }

    create() {
        // Configuração do fundo
        this.bg.obj = this.add.image(this.bg.x, this.bg.y, 'bg').setOrigin(0, 0);

        // Configuração do jogador
        if (this.sys.game.device.os.desktop) {
            this.player.obj = this.physics.add.sprite(170, 130, 'submarino').setScale(0.1);
        } else {
            this.player.obj = this.physics.add.sprite(170, 130, 'submarinoVermelho').setScale(0.1);
        }
        this.player.obj.body.setSize(50, 80, true);
        this.player.obj.setCollideWorldBounds(true);
        this.player.obj.body.setGravityY(300);

        // Configuração das colunas
        this.cols.col1_obj = this.add.image(this.cols.x, this.cols.y, 'colUpper').setOrigin(0, 0);
        this.cols.col2_obj = this.add.image(this.cols.x, this.cols.y + this.cols.height + this.cols.space, 'colBottom').setOrigin(0, 0);
        this.physics.add.existing(this.cols.col1_obj);
        this.physics.add.existing(this.cols.col2_obj);
        this.cols.col1_obj.body.allowGravity = false;
        this.cols.col2_obj.body.allowGravity = false;
        this.cols.col1_obj.body.setVelocityX(-this.cols.speed);
        this.cols.col2_obj.body.setVelocityX(-this.cols.speed);

        // Configuração de controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

        // Configuração de colisões
        this.physics.add.overlap(this.player.obj, this.cols.col1_obj, this.hitCol, null, this);
        this.physics.add.overlap(this.player.obj, this.cols.col2_obj, this.hitCol, null, this);

        // Texto da pontuação
        this.scoreText = this.add.text(0, 15, 'Score: 0', { fontSize: '20px', fill: '#000', align: 'right' });
        this.scoreText.x = this.game.config.width - this.scoreText.width - 15;

        // Adiciona o listener de mudança de orientação
        this.scale.on('orientationchange', function(orientation) {
            if (orientation === Phaser.Scale.PORTRAIT) {
                console.log('PORTRAIT');
            }  
            if (orientation === Phaser.Scale.LANDSCAPE) {
                console.log('LANDSCAPE');
            } 
        });
    }

    update() {
        // Lógica de atualização (exemplo)
        if (this.gameControls.over) {
            return;
        }

        this.bg.x--;
        if (this.bg.x < this.bg.x_end) {
            this.bg.x = this.bg.x_start;
        }
        this.bg.obj.x = this.bg.x;

        if (this.cols.col1_obj.x < -this.cols.width) {
            this.cols.x = Phaser.Math.FloatBetween(this.cols.min_x, this.cols.max_x);
            this.cols.col1_obj.x = this.cols.x;
            this.cols.col2_obj.x = this.cols.x;
            this.cols.y = Phaser.Math.FloatBetween(this.cols.min_y, this.cols.max_y);
            this.cols.col1_obj.y = this.cols.y;
            this.cols.col2_obj.y = this.cols.y + this.cols.height + this.cols.space;
            this.gameControls.current_col_scored = false;
        }

        if (this.cursors.left.isDown) {
            this.player.obj.setX(this.player.obj.x - 5);
        } else if (this.cursors.right.isDown) {
            this.player.obj.setX(this.player.obj.x + 5);
        }

        if (this.cursors.up.isDown || this.cursors.space.isDown || this.pointer.isDown) {
            this.player.obj.body.setVelocityY(-200);
        }

        if (!this.gameControls.current_col_scored && this.player.obj.x > this.cols.col1_obj.x + this.cols.width / 2) {
            this.gameControls.score++;
            this.gameControls.current_col_scored = true;
            this.scoreText.setText('Score: ' + this.gameControls.score);
            this.scoreText.x = this.game.config.width - this.scoreText.width - 15;
        }
    }

    hitCol(player_obj, col_obj) {
        // Lógica de colisão (exemplo)
        this.physics.pause();
        this.player.obj.setTint(0xff0000);
        this.gameControls.over = true;
        this.cols.col1_obj.body.setVelocityX(0);
        this.cols.col2_obj.body.setVelocityX(0);
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'Game Over',
            { fontSize: '40px', fill: '#ff0000' }
        ).setOrigin(0.5);
    }
}

export default TelaJogo;