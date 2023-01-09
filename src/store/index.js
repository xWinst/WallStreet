import { injectStores } from '@mobx-devtools/tools';
import Game from './gameState';
import Player from 'store/player';

const player = new Player('Anonymus');
const game = new Game([player]);

injectStores({
    game,
});

export default game;
