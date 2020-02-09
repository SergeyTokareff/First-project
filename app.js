const tasks = [{
    _id: '5d2ca9e2e03d40b326596aa7',
    completed: true,
    body: 'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
    title: 'Eu ea incididunt sunt consectetur fugiat non.',
  },
  {
    _id: '5d2ca9e29c8a94095c1288e0',
    completed: false,
    body: 'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
    title: 'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
  },
  {
    _id: '5d2ca9e2e03d40b3232496aa7',
    completed: true,
    body: 'Occaecat non ea quis occaecat ad culpa amet deserunt incididunt elit fugiat pariatur. Exercitation commodo culpa in veniam proident laboris in. Excepteur cupidatat eiusmod dolor consectetur exercitation nulla aliqua veniam fugiat irure mollit. Eu dolor dolor excepteur pariatur aute do do ut pariatur consequat reprehenderit deserunt.\r\n',
    title: 'Eu ea incididunt sunt consectetur fugiat non.',
  },
  {
    _id: '5d2ca9e29c8a94095564788e0',
    completed: false,
    body: 'Aliquip cupidatat ex adipisicing veniam do tempor. Lorem nulla adipisicing et esse cupidatat qui deserunt in fugiat duis est qui. Est adipisicing ipsum qui cupidatat exercitation. Cupidatat aliqua deserunt id deserunt excepteur nostrud culpa eu voluptate excepteur. Cillum officia proident anim aliquip. Dolore veniam qui reprehenderit voluptate non id anim.\r\n',
    title: 'Deserunt laborum id consectetur pariatur veniam occaecat occaecat tempor voluptate pariatur nulla reprehenderit ipsum.',
  },
];

(function (arrOfTasks) {
  const objOfTasks = arrOfTasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {});


  // Elements UI
  const listContainer = document.querySelector('.tasks-list-section .list-group');
  const form = document.forms['addTask'];
  const inputTitle = form.elements['title'];
  const inputBody = form.elements['body'];
  const emptyListSpan = document.createElement('span');
  const divTasks = document.querySelector('.tasks-list-section .container');

  emptyListSpan.textContent = 'Список задач пуст';
  emptyListSpan.classList.add('h4');


  // Events
  sortTasks(arrOfTasks);
  renderAllTasks(arrOfTasks);


  form.addEventListener('submit', onFormSubmitHandler);
  listContainer.addEventListener('click', onDeleteHandler);
  listContainer.addEventListener('click', onCompleteHandler);
  listContainer.addEventListener('click', onRestoreBtn);
  divTasks.addEventListener('click', onUncompletedBtn);
  divTasks.addEventListener('click', onAllTasksBtn);

  function sortTasks() {
    arrOfTasks.sort(function (a, b) {
      return a.completed - b.completed;
    });
  }

  function renderAllTasks(tasksList) {
    if (!tasksList) {
      console.error("Передайте список задач!");
      return;
    }

    if (arrOfTasks.length === 0) {
      listContainer.appendChild(emptyListSpan);
      return;
    }


    const fragment = document.createDocumentFragment();
    Object.values(tasksList).forEach(task => {
      const li = listItemTemplate(task);
      fragment.appendChild(li);
    });
    listContainer.appendChild(fragment);

  }

  function listItemTemplate({
    _id,
    title,
    body,
    completed
  } = {}) {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'align-items-center', 'flex-wrap', 'mt-2');
    if (completed) {
      li.classList.add('bg-success');
    }
    li.setAttribute('data-task-id', _id);

    const span = document.createElement('span');
    span.textContent = title;
    span.style.fontWeight = "bold";

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete task';
    deleteBtn.classList.add('btn', 'btn-danger', 'ml-auto', 'delete-btn');

    const article = document.createElement('p');
    article.textContent = body;
    article.classList.add('mt-2', 'w-100');

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Complete task';
    completeBtn.classList.add('btn', 'btn-info', 'mr-auto', 'complete-btn');

    const restoreBtn = document.createElement('button');
    restoreBtn.textContent = 'Restore task';
    restoreBtn.classList.add('btn', 'btn-secondary', 'mr-auto', 'restore-btn');

    li.appendChild(span);
    li.appendChild(article);
    if (!completed) {
      li.appendChild(completeBtn);
    }

    if (completed) {
      li.appendChild(restoreBtn);
    }
    li.appendChild(deleteBtn);

    return li;
  }

  function onFormSubmitHandler(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const bodyValue = inputBody.value;

    if (!titleValue || !bodyValue) {
      alert("Пожалуйста введите title и body");
      return;
    }


    const task = createNewTask(titleValue, bodyValue);
    const listItem = listItemTemplate(task);
    listContainer.insertAdjacentElement("afterbegin", listItem);
    form.reset();
  }

  function createNewTask(title, body) {
    const newTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`
    };

    objOfTasks[newTask._id] = newTask;
    arrOfTasks.unshift(newTask);
    return {
      ...newTask
    };
  }

  function deleteTask(id) {
    const {
      title
    } = objOfTasks[id];
    const isConfirm = confirm(`Точно вы хотите удалить задачу: ${title}`);
    if (!isConfirm) return isConfirm;
    delete objOfTasks[id];
    return isConfirm;
  }

  function deleteTaskFromHtml(confirmed, el) {
    if (!confirmed) return;
    el.remove();
  }

  function onDeleteHandler({
    target
  }) {
    if (target.classList.contains('delete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      const confirmed = deleteTask(id);
      deleteTaskFromHtml(confirmed, parent);
    }
  }


  function onCompleteHandler({
    target
  }) {
    if (target.classList.contains('complete-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      objOfTasks[id].completed = true;

      parent.classList.add('bg-success');
      /**/
      console.log(divBtn);
      if (divBtn.classList.contains('all-tasks')) {
        listContainer.innerHTML = "";
        sortTasks(arrOfTasks);
        renderAllTasks(arrOfTasks);
      } else if (divBtn.classList.contains('uncompleted-tasks')) {
        listContainer.innerHTML = "";
        const uncompletedTasks = arrOfTasks.filter(arrOfTasks => arrOfTasks.completed === false);
        renderAllTasks(uncompletedTasks);
      }
    }
  }

  const mutationObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.target.childNodes.length === 0) {
        listContainer.insertAdjacentElement("afterbegin", emptyListSpan);
      } else if (mutation.target.childNodes.length > 1) {
        emptyListSpan.remove();
      }
    });
  });

  mutationObserver.observe(listContainer, {
    attributes: true,
    characterData: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true
  });

  function showBtn() {
    const divBtn = document.createElement('div');
    divBtn.classList.add('d-flex', 'mb-3', 'all-tasks');
    //divBtn.setAttribute('data-task', 'all-tasks');

    const allTasks = document.createElement('button');
    allTasks.textContent = 'All tasks';
    allTasks.classList.add('btn', 'btn-success', 'all-tasks-btn');

    const uncompletedTasksBtn = document.createElement('button');
    uncompletedTasksBtn.textContent = 'Uncompleted Tasks';
    uncompletedTasksBtn.classList.add('btn', 'btn-secondary', 'ml-2', 'uncompleted-btn');

    divBtn.appendChild(allTasks);
    divBtn.appendChild(uncompletedTasksBtn);

    return divBtn;
  }

  const divBtn = showBtn();
  divTasks.insertAdjacentElement("afterbegin", divBtn);

  function onUncompletedBtn({
    target
  }) {
    if (target.classList.contains('uncompleted-btn')) {
      const uncompletedTasks = arrOfTasks.filter(arrOfTasks => arrOfTasks.completed === false);
      listContainer.innerHTML = "";
      divBtn.classList.remove('all-tasks');
      divBtn.classList.add('uncompleted-tasks');
      renderAllTasks(uncompletedTasks);
    }
  }

  function onAllTasksBtn({
    target
  }) {
    if (target.classList.contains('all-tasks-btn')) {
      listContainer.innerHTML = "";
      sortTasks(arrOfTasks);
      divBtn.classList.remove('uncompleted-tasks');
      divBtn.classList.add('all-tasks');
      renderAllTasks(arrOfTasks);
    }
  }

  function onRestoreBtn({
    target
  }) {
    if (target.classList.contains('restore-btn')) {
      const parent = target.closest('[data-task-id]');
      const id = parent.dataset.taskId;
      objOfTasks[id].completed = false;
      listContainer.innerHTML = "";
      sortTasks(arrOfTasks);
      renderAllTasks(arrOfTasks);
    }
  }


  for(let i=0; i<localStorage.length; i++) {
    let key = localStorage.key(i);
    console.log(`${key}: ${localStorage.getItem(key)}`);
  }
})(tasks);
