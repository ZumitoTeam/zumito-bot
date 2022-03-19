module.exports = {
    handleEvents: function(eventEmitter, path) {
        fs.readdir(path, (err, files) => { // We use the method readdir to read what is in the events folder
            if (err) return console.error(err); // If there is an error during the process to read all contents of the ./events folder, throw an error in the console
            files.forEach(file => {
                const eventFunction = require(`${path}/${file}`); // Here we require the event file of the events folder
                if (eventFunction.disabled) return; // Check if the eventFunction is disabled. If yes return without any error
        
                const event = eventFunction.event || file.split('.')[0]; // Get the exact name of the event from the eventFunction variable. If it's not given, the code just uses the name of the file as name of the event
                const emitter = (typeof eventFunction.emitter === 'string' ? eventEmitter[eventFunction.emitter] : eventFunction.emitter) || eventEmitter; // Here we define our emitter. This is in our case the client (the bot)
                const once = eventFunction.once; // A simple variable which returns if the event should run once
        
                // Try catch block to throw an error if the code in try{} doesn't work
                try {
                    emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.execute(...args, client)); // Run the event using the above defined emitter (client)
                } catch (error) {
                    console.error(error.stack); // If there is an error, console log the error stack message
                }
            });
        });
    }
}