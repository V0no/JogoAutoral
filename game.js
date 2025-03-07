import TelaInicial from './scenes/TelaInicial.js';
import TelaJogo from './scenes/TelaJogo.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT
    },
    autoCenter: Phaser.Scale.CENTER,
    width: 400,
    height: 600,
    backgroundColor: '#39addd',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 10 },
            debug: false 
        }
    },
    parent: "game",
    dom: {
        createContainer: true,
    },
    scene: [TelaInicial, TelaJogo]
};

var game = new Phaser.Game(config);
game.scene.start('TelaInicial');
