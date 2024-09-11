document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');
    const taskDate = document.getElementById('taskDate');
    const taskTime = document.getElementById('taskTime');
    const taskList = document.getElementById('taskList');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        const date = taskDate.value;
        const time = taskTime.value;
        if (taskText === '') return;

        const li = document.createElement('li');
        li.draggable = true;
        li.innerHTML = `
            <input type="checkbox" class="checkbox">
            <span>${taskText}</span>
            <div class="date-time">${date ? `Due: ${date}` : ''}${time ? ` ${time}` : ''}</div>
            <button class="remove-btn">Remove</button>
        `;
        taskList.appendChild(li);

        li.querySelector('.checkbox').addEventListener('change', () => {
            li.classList.toggle('completed');
        });

        li.querySelector('.remove-btn').addEventListener('click', () => {
            li.classList.add('removing');
            setTimeout(() => {
                taskList.removeChild(li);
            }, 300); // Match with the CSS transition duration
        });

        // Drag and Drop
        li.addEventListener('dragstart', () => {
            li.classList.add('dragging');
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
        });

        taskList.addEventListener('dragover', (e) => {
            e.preventDefault();
            const dragging = document.querySelector('.dragging');
            const afterElement = getDragAfterElement(taskList, e.clientY);
            if (afterElement == null) {
                taskList.appendChild(dragging);
            } else {
                taskList.insertBefore(dragging, afterElement);
            }
        });

        taskList.addEventListener('dragenter', (e) => {
            e.preventDefault();
            taskList.classList.add('drag-over');
        });

        taskList.addEventListener('dragleave', () => {
            taskList.classList.remove('drag-over');
        });

        taskList.addEventListener('drop', () => {
            taskList.classList.remove('drag-over');
        });

        taskInput.value = '';
        taskDate.value = '';
        taskTime.value = '';
        taskInput.focus();
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
