import { load } from './save.js';
import { initGame } from './core/state.js';
import { render } from './ui/render.js';

if (!load()) initGame(null);
else render();
