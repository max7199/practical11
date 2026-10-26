const taskEvents = require('./events');

// Listener for task-created event
taskEvents.on('task-created', (task) => {
    // Artificial delay to simulate a slow notification handler and make async timing visible
    setTimeout(() => {
        try {
            console.log(`[Notification] Task "${task.title}" created at ${new Date().toISOString()}`);
            
            // To demonstrate the error handling, we throw an error if title contains 'error'
            if (task.title && task.title.toLowerCase().includes('error')) {
                throw new Error("Simulated error in task-created handler");
            }
        } catch (err) {
            taskEvents.emit('error', err);
        }
    }, 2000);
});

// Listener for task-deleted event
taskEvents.on('task-deleted', (task) => {
    setTimeout(() => {
        console.log(`[Notification] Task "${task.title}" deleted at ${new Date().toISOString()}`);
    }, 2000);
});

// Listener for error event
taskEvents.on('error', (err) => {
    console.error(`[Error Listener] Caught an error: ${err.message}`);
});
