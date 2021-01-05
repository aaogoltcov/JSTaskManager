'use strict';

import taskManager from "./taskManager";

const manager = new taskManager(
  document.querySelector('[data-id=task-text]'),
  document.querySelector('[data-section=tasks-list]'),
  document.querySelector('[data-section=pinned-tasks-list]'),
  document.querySelector('[data-action=task]'),
)

manager.init();
