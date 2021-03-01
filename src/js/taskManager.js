'use strict';

export default class taskManager {
  constructor(taskInput, tasksField, pinedTasksField, newTaskButton) {
    this.taskInput = taskInput;
    this.tasksField = tasksField;
    this.pinedTasksField = pinedTasksField;
    this.newTaskButton = newTaskButton;

    this.messageNoTasks = document.querySelector('.no-tasks');
    this.messageNoPinnedTasks = document.querySelector('.no-pinned-tasks');
    this.messagePinnedTasksNotFound = document.querySelector('.no-filtered-pinned-tasks');
    this.messageTasksNotFound = document.querySelector('.no-filtered-tasks');
    this.allTasks = Array();
    this.allFilteredTasks = Array();
    this.mode = 'show';
  }

  init() {
    this.newTaskEventListener();
    this.newPinnedTaskEventListener();
    this.newUnpinnedTaskEventListener();
    this.newFilterEventListener();
  }

  newFilterEventListener() {
    this.taskInput.addEventListener('input', () => {
      this.allFilteredTasks = Array();
      this.allTasks.forEach(value => {
        if (value.task.toLowerCase().includes(this.taskInput.value.trim().toLowerCase())) {
          this.allFilteredTasks.push(value);
        }
      })

      this.tasksField.innerHTML = '';
      this.pinedTasksField.innerHTML = '';

      if (this.taskInput.value.length > 0) {
        this.mode = 'search';
        this.redrawLists(this.allFilteredTasks);
      } else {
        this.mode = 'show';
        this.redrawLists(this.allTasks);
      }

    })
  }

  newTaskEventListener() {
    this.newTaskButton.addEventListener('click', event => {
      event.preventDefault();
      const messageNotFilledInput = document.querySelector('.no-filled-input');
      this.mode = 'show';

      if (this.taskInput.value.length > 0) {
        this.addNewTask(this.taskInput.value);
        this.redrawLists(this.allTasks);
        this.taskInput.value = '';

        if (!messageNotFilledInput.classList.contains('hidden')) {
          messageNotFilledInput.classList.add('hidden');
        }
      } else {
        if (messageNotFilledInput.classList.contains('hidden')) {
          messageNotFilledInput.classList.remove('hidden');
        }
      }
    })
  }

  newPinnedTaskEventListener() {
    this.tasksField.addEventListener('click', event => {
      let tasksCollection = this.tasksField.children;
      this.pinAndUnPinTasks(this.pinedTasksField, tasksCollection, event);
    })
  }

  newUnpinnedTaskEventListener() {
    this.pinedTasksField.addEventListener('click', event => {
      let tasksCollection = this.pinedTasksField.children;
      this.pinAndUnPinTasks(this.tasksField, tasksCollection, event);
    })
  }

  pinAndUnPinTasks(field, tasksCollection, event) {
    let element = tasksCollection[taskManager.getElementIndex(tasksCollection, event)];
    if (element) {
      field.insertAdjacentElement('beforeend', element) ;
      this.changeCheckedElement(element.querySelector('input').dataset.id);
    }
    this.messageTreatment();
  }

  addNewTask(task) { this.allTasks.push({checked: false, task: `${task}`, id: `${Date.now()}`}) }

  removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  redrawLists(array) {
    this.removeAllChildNodes(this.tasksField);
    this.removeAllChildNodes(this.pinedTasksField);
    if (this.mode === 'search') {
      for (let element of array) {
        if (!element.checked) {
          this.tasksField.insertAdjacentHTML('beforeend',
            `<div class="task"><input type="checkbox" data-id=${element.id}><li>${element.task}</li></div>`)
        } else {
          this.pinedTasksField.insertAdjacentHTML('beforeend',
            `<div class="task"><input type="checkbox" data-id=${element.id} checked><li>${element.task}</li></div>`)
        }
      }
    } else if (this.mode === 'show') {
      for (let element of this.allTasks) {
        if (!element.checked) {
          this.tasksField.insertAdjacentHTML('beforeend',
            `<div class="task"><input type="checkbox" data-id=${element.id}><li>${element.task}</li></div>`)
        } else {
          this.pinedTasksField.insertAdjacentHTML('beforeend',
            `<div class="task"><input type="checkbox" data-id=${element.id} checked><li>${element.task}</li></div>`)
        }
      }
    }
    this.messageTreatment();
  }

  messageTreatment() {
    if (this.mode === 'show') {
      this.removeMessagePinnedTasksNotFound();
      this.removeMessageTasksNotFound();
      if (this.pinedTasksField.children.length === 0) {
        this.addMessageNoPinnedTasks();
      } else {
        this.removeMessageNoPinnedTasks();
      }
      if (this.tasksField.children.length === 0) {
        this.addMessageNoTasks();
      } else {
        this.removeMessageNoTasks();
      }
    } else if (this.mode === 'search') {
      this.removeMessageNoTasks();
      if (this.tasksField.children.length === 0) {
        this.addMessageTasksNotFound();
      } else {
        this.removeMessageTasksNotFound();
      }
    }
  }

  addMessageNoPinnedTasks() {
    if (this.messageNoPinnedTasks.classList.contains('hidden')) {
      this.messageNoPinnedTasks.classList.remove('hidden');
    }
  }

  addMessageNoTasks() {
    if (this.messageNoTasks.classList.contains('hidden')) { this.messageNoTasks.classList.remove('hidden') }
  }

  removeMessageNoPinnedTasks() {
    if (!this.messageNoPinnedTasks.classList.contains('hidden')) { this.messageNoPinnedTasks.classList.add('hidden') }
  }

  removeMessageNoTasks() {
    if (!this.messageNoTasks.classList.contains('hidden')) { this.messageNoTasks.classList.add('hidden') }
  }

  // addMessagePinnedTasksNotFound() {
  //   if (this.messagePinnedTasksNotFound.classList.contains('hidden')) {
  //     this.messagePinnedTasksNotFound.classList.remove('hidden')
  //   }
  // }

  addMessageTasksNotFound() {
    if (this.messageTasksNotFound.classList.contains('hidden')) {
      this.messageTasksNotFound.classList.remove('hidden')
    }
  }

  removeMessagePinnedTasksNotFound() {
    if (!this.messagePinnedTasksNotFound.classList.contains('hidden')) {
      this.messagePinnedTasksNotFound.classList.add('hidden')
    }
  }

  removeMessageTasksNotFound() {
    if (!this.messageTasksNotFound.classList.contains('hidden')) { this.messageTasksNotFound.classList.add('hidden') }
  }

  changeCheckedElement(elementId) {
    this.allTasks.forEach(element => {
      if (element.id === elementId) { element.checked ? element.checked = false : element.checked = true }
    })
  }

  static getElementIndex(collection, event) {
    return Array.from(collection).findIndex((element) => {
      if (element.querySelector('input') === event.target) { return true }
    })
  }
}
