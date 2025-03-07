class TelaJogo extends Phaser.Scene {

    constructor() {
        super({
            key: 'TelaJogo', // Configuração da chave da cena
        });
    }

    // Inicialização de variáveis e configurações da cena
    init() {
        // Ajuste do fundo: posição y alterada para 0 para alinhamento ao topo
        this.bg = {
            x_start: 0,
            x: 0,
            y: 0,  // Alterado de 200 para 0
            x_end: -800,
            obj: null
        };

        // 2) COLUNA
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

        // 3) JOGADOR
        this.player = {
            width: 170,
            height: 133,
            obj: null
        };

        // 4) CONTROLES DA RODADA
        this.gameControls = {
            over: false,
            current_col_scored: false,
            score: 0
        };
    }

    // Pré-carregamento de recursos
    preload() {
        this.load.image('bg', 'assets/background.png');
        this.load.image('submarino', 'assets/submarino.png'); // Usando image, sem spritesheet
        this.load.image('colBottom', 'assets/coluna_bottom.png');
        this.load.image('colUpper', 'assets/coluna_upper.png');
    }

    // Criação de elementos e configurações iniciais da cena
    create() {
        // 1) Adiciona a imagem de fundo alinhada ao topo
        this.bg.obj = this.add.image(this.bg.x, this.bg.y, 'bg').setOrigin(0, 0);

        // 2) Adiciona imagens das colunas
        this.cols.col1_obj = this.add.image(this.cols.x, this.cols.y, 'colUpper').setOrigin(0, 0);
        this.cols.col2_obj = this.add.image(this.cols.x, this.cols.y + this.cols.height + this.cols.space, 'colBottom').setOrigin(0, 0);
        this.physics.add.existing(this.cols.col1_obj);
        this.physics.add.existing(this.cols.col2_obj);
        this.cols.col1_obj.body.allowGravity = false;
        this.cols.col2_obj.body.allowGravity = false;
        this.cols.col1_obj.body.setVelocityX(-this.cols.speed);
        this.cols.col2_obj.body.setVelocityX(-this.cols.speed);

        // 3) Adiciona jogador com imagem reduzida (escala 0.1)
        this.player.obj = this.physics.add.sprite(170, 130, 'submarino').setScale(0.1);
        this.player.obj.body.setSize(50, 80, true);
        this.player.obj.setCollideWorldBounds(true);

        // 6) Adiciona os cursores que movimentarão o jogador
        this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

        // 7) Adiciona os monitores de colisão
        this.physics.add.overlap(this.player.obj, this.cols.col1_obj, this.hitCol, null, this);
        this.physics.add.overlap(this.player.obj, this.cols.col2_obj, this.hitCol, null, this);

        // 8) Mostra a pontuação no canto superior direito
        this.scoreText = this.add.text(0, 15, 'Score: 0', { fontSize: '20px', fill: '#000', align: 'right' });
        this.scoreText.x = this.game.config.width - this.scoreText.width - 15;
    }

    // Atualização lógica do jogo a cada frame
    update() {
        if (this.gameControls.over) {
            return;
        }

        // Atualiza a posição da imagem de fundo (movimento horizontal)
        this.bg.x--;
        if (this.bg.x < this.bg.x_end) {
            this.bg.x = this.bg.x_start;
        }
        this.bg.obj.x = this.bg.x;

        // Atualiza posição das colunas
        this.cols.x = this.cols.col1_obj.x;
        if (this.cols.x < -this.cols.width) {
            this.cols.x = Phaser.Math.FloatBetween(this.cols.min_x, this.cols.max_x);
            this.cols.col1_obj.x = this.cols.x;
            this.cols.col2_obj.x = this.cols.x;

            this.cols.y = Phaser.Math.FloatBetween(this.cols.min_y, this.cols.max_y);
            this.cols.col1_obj.y = this.cols.y;
            this.cols.col2_obj.y = this.cols.y + this.cols.height + this.cols.space;

            this.gameControls.current_col_scored = false;
        }

        // Controles de movimentação do jogador
        if (this.cursors.left.isDown)
            this.player.obj.setX(this.player.obj.x - 5);
        else if (this.cursors.right.isDown)
            this.player.obj.setX(this.player.obj.x + 5);
        else if (this.cursors.up.isDown || this.cursors.space.isDown || this.pointer.isDown)
            this.player.obj.setY(this.player.obj.y - this.game.config.physics.arcade.gravity.y);
        else if (this.cursors.down.isDown)
            this.player.obj.setY(this.player.obj.y + this.game.config.physics.arcade.gravity.y);

        // Verifica se o jogador passou pelas colunas e atualiza a pontuação
        if (!this.gameControls.current_col_scored) {
            if (this.player.obj.x - this.player.width / 2 > this.cols.x + this.cols.width) {
                this.gameControls.score++;
                this.gameControls.current_col_scored = true;
                this.scoreText.setText('Score: ' + this.gameControls.score);
                this.scoreText.x = this.game.config.width - this.scoreText.width - 15;
            }
        }
    }

    // Função chamada quando o jogador colide com uma coluna
    hitCol(player_obj, col_obj) {
        this.physics.pause();
        this.player.obj.setTint(0xff0000);
        this.gameControls.over = true;
        // Exibe o texto "Game Over" centralizado na tela
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'Game Over',
            { fontSize: '40px', fill: '#ff0000' }
        ).setOrigin(0.5);
    }
}

export default TelaJogo;
