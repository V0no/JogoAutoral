// Definindo a cena de boas-vindas usando a biblioteca Phaser
class TelaInicial extends Phaser.Scene {

    // Construtor da cena
    constructor() {
        super({
            key: 'TelaInicial', // Configuração da chave da cena
            backgroundColor: '#000', // Configuração da cor de fundo da cena
        });
    }

    // Pré-carregamento de recursos
    preload() {
        this.load.image("start", "assets/start.png"); // Carregando a imagem do botão "start"
    }

    // Função chamada quando a cena é criada
    create() {
        // Configuração das teclas e variáveis da cena
        this.cursors = this.input.keyboard.createCursorKeys();
        this.returnKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Configuração do texto de boas-vindas
        var text = { height: 20, padding: 15, content: "Submarino em apuros!" }
        this.message = this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2 - text.padding * 2 - text.height,
            text.content, {
                color: "#FFFFFF",
                fontSize: 30, // Diminuído o tamanho da fonte para caber na tela
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        // Configuração do botão de "start"
        this.startBt = this.add.image(this.game.config.width / 2, this.message.y + text.height + 20, 'start')
            .setScale(2.0) // Aumentado o tamanho do botão
            .setOrigin(0.5, 0) // Centralizado o botão
            .setInteractive();

        // Configuração de evento para iniciar o jogo ao clicar no botão "start"
        this.startBt.on('pointerdown', function () {
            this.game.highScore = 0;
            this.scene.start('TelaJogo', this.game);
        }, this);

        // Configuração do texto de controles
        this.controlsText = this.add.text(
            this.game.config.width / 2,
            this.startBt.y + this.startBt.displayHeight + 50, // Aumentado o deslocamento vertical
            "Como jogar: seu objetivo no jogo é acumular pontos e evitar tocar nas barreiras que irão surgir no caminho.\nMovimentação: utilize as SETAS para BAIXO e para CIMA para controlar o movimento do jogador.", {
                color: "#FFFFFF",
                fontSize: 13, // Tamanho da fonte para o texto de controles
                fontStyle: "bold",
                align: "center",
                wordWrap: { width: this.game.config.width - 40 } // Ajusta a largura do texto para caber na tela
            }
        ).setOrigin(0.5);
    }
}

// Exporta a classe TelaInicial usando CommonJS
export default TelaInicial;