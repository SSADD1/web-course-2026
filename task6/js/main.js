import { SnakeModel } from './model/SnakeModel.js';
import { SnakeView } from './view/SnakeView.js';
import { SnakeController } from './controller/SnakeController.js';

// Точка входа: создаём MVC-компоненты и связываем их.
const model = new SnakeModel();
const view = new SnakeView(model);
new SnakeController(model, view);
