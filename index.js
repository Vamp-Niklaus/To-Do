window.addEventListener('load', () => {
    const form = document.querySelector('#form');
    const input = document.querySelector('#add-task');
    const task_content = document.querySelector('#task-list');
  
    // Load tasks from local storage on page load
    loadTasks();
  
    form.addEventListener('submit', function(f) {
      f.preventDefault();
      const value = input.value;
  
      const urlRegex = /\[(https?:\/\/[^\s]+)\]/;
      const match = value.match(urlRegex);
  
      if (match && value.trim() === match[0]) {
        alert("Please add some task along with the URL.");
        return;
      }
  
      if (value.trim() === "") {
        alert("Please enter some task");
        return;
      }
  
      // Add task to the list and save it to local storage
      addTask(value);
      saveTask(value);
  
      input.value = "";
    });
  
    function addTask(value) {
      const task = document.createElement('div');
      task.classList.add('tasks');
  
      const task_input = document.createElement('div');
      task_input.classList.add('content');
      task.appendChild(task_input);
  
      const input_text = document.createElement('div');
      input_text.style.cssText = 'background:transparent; text-align:center;color:yellow;border-radius: 20px;';
  
      const hidden_full_text = document.createElement('input');  // To store the full text with the URL
      hidden_full_text.type = 'hidden';
      hidden_full_text.value = value;
      hidden_full_text.classList.add('hidden-full-text');
      task_input.appendChild(hidden_full_text);
  
      const urlRegex = /\[(https?:\/\/[^\s]+)\]/;
      const match = value.match(urlRegex);
  
      if (match) {
        const taskText = value.substring(0, match.index).trim();
        const url = match[1];
  
        if (taskText === "") {
          alert("Please add some task text with the URL.");
          return;
        }
  
        input_text.innerHTML = `<a href="${url}" target="_blank" style="color:yellow; text-decoration:none;">${taskText}</a>`;
      } else {
        input_text.textContent = value;
      }
  
      task_input.appendChild(input_text);
  
      const input_action = document.createElement('div');
      input_action.classList.add('actions');
      task.appendChild(input_action);
  
      const edit = document.createElement('button');
      edit.id = 'edit';
      edit.innerText = 'Edit';
      edit.style.cssText += 'background: rgb(105, 105, 247);border-radius:10px';
      input_action.appendChild(edit);
  
      edit.addEventListener('click', function(e) {
        if (edit.innerText == 'Edit') {
          input_text.contentEditable = "true";
          input_text.textContent = hidden_full_text.value;  // Show full text (with URL) during edit
          input_text.focus();
          edit.innerText = 'Save';
          edit.style.cssText += 'background:green;border-radius:10px';
        } else {
          const updatedValue = input_text.textContent;
  
          if (updatedValue == "") {
            alert("Please add some task");
            return;
          } else {
            hidden_full_text.value = updatedValue;  // Update the hidden full text
            input_text.setAttribute('readonly', 'readonly');
            edit.innerText = 'Edit';
            edit.style.cssText += 'background: rgb(105, 105, 247);border-radius:10px';
  
            // Update the task display with the updated value (reparse for URL)
            const newMatch = updatedValue.match(urlRegex);
            if (newMatch) {
              const updatedTaskText = updatedValue.substring(0, newMatch.index).trim();
              const updatedUrl = newMatch[1];
              input_text.innerHTML = `<a href="${updatedUrl}" target="_blank" style="color:yellow; text-decoration:none;">${updatedTaskText}</a>`;
            } else {
              input_text.textContent = updatedValue;
            }
  
            // Save the updated task to local storage
            updateTaskInLocalStorage(hidden_full_text.getAttribute('old-value'), updatedValue);
            hidden_full_text.setAttribute('old-value', updatedValue);  // Update old value
          }
        }
      });
  
      const del = document.createElement('button');
      del.id = 'delete';
      del.innerText = 'Delete';
      del.style.cssText += 'border-radius:10px;';
      input_action.appendChild(del);
  
      del.addEventListener('click', function(d) {
        if (confirm("This will delete the task from your task-list?")) {
          task_content.removeChild(task);
          removeTask(hidden_full_text.value);
        } else {
          return;
        }
      });
  
      task_content.appendChild(task);
  
      // Store the original value to track for updates
      hidden_full_text.setAttribute('old-value', value);
    }
  
    // Function to save task to local storage
    function saveTask(task) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    // Function to load tasks from local storage
    function loadTasks() {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach((task) => {
        addTask(task);
      });
    }
  
    // Function to update the task in local storage
    function updateTaskInLocalStorage(oldTask, newTask) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      const taskIndex = tasks.indexOf(oldTask);
      if (taskIndex !== -1) {
        tasks[taskIndex] = newTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    }
  
    // Function to remove task from local storage
    function removeTask(taskToRemove) {
      let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks = tasks.filter((task) => task !== taskToRemove);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
  