// DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

// Task array to store all tasks
let tasks = [];
let taskIdCounter = 1;

// Initialize the app
function init() {
    addEventListeners();
    updateEmptyState();
}

// Add event listeners
function addEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', handleKeyPress);
}

// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        addTask();
    }
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Validate input
    if (taskText === '') {
        showInputError();
        return;
    }
    
    // Create task object
    const task = {
        id: taskIdCounter++,
        text: taskText,
        completed: false
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Create and add task element
    createTaskElement(task);
    
    // Clear input and update UI
    taskInput.value = '';
    updateEmptyState();
    
    // Add success feedback
    addTaskBtn.style.background = '#10b981';
    setTimeout(() => {
        addTaskBtn.style.background = '#3b82f6';
    }, 200);
}

// Show input error
function showInputError() {
    taskInput.style.borderColor = '#ef4444';
    taskInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    setTimeout(() => {
        taskInput.style.borderColor = '#e2e8f0';
        taskInput.style.boxShadow = 'none';
    }, 1000);
}

// Create task element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.taskId = task.id;
    
    li.innerHTML = `
        <span class="task-text">${escapeHtml(task.text)}</span>
        <button class="remove-btn">Remove</button>
    `;
    
    // Add event listeners
    const taskText = li.querySelector('.task-text');
    const removeBtn = li.querySelector('.remove-btn');
    
    taskText.addEventListener('click', () => toggleTask(task.id));
    removeBtn.addEventListener('click', () => removeTask(task.id));
    
    // Add to DOM
    taskList.appendChild(li);
}

// Toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    
    if (task && taskElement) {
        task.completed = !task.completed;
        
        if (task.completed) {
            taskElement.classList.add('completed');
        } else {
            taskElement.classList.remove('completed');
        }
    }
}

// Remove task
function removeTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    
    if (taskElement) {
        // Add removal animation
        taskElement.classList.add('removing');
        
        // Remove after animation
        setTimeout(() => {
            // Remove from tasks array
            tasks = tasks.filter(t => t.id !== taskId);
            
            // Remove from DOM
            taskElement.remove();
            
            // Update empty state
            updateEmptyState();
        }, 300);
    }
}

// Update empty state visibility
function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);