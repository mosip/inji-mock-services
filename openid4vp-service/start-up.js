const readline = require('readline');
const fs = require('fs');
const { spawn } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Setting up the application...');

try {
    // Read the current constants.js file to get the existing baseUrl
    const data = fs.readFileSync('constants.js', 'utf8');
    const baseUrlMatch = data.match(/const baseUrl = "([^"]+)"/);
    const currentBaseUrl = baseUrlMatch ? baseUrlMatch[1] : '';

    rl.question(`Please enter your base URL (press Enter to keep current value "${currentBaseUrl}"): `, (ngrokUrl) => {
        // Only update if user provided a value
        if (ngrokUrl.trim()) {
            console.log(`Updating constants.js with URL: ${ngrokUrl}`);

            // Replace the baseUrl constant with the provided ngrok URL
            const updatedData = data.replace(
                /const baseUrl = .*$/m,
                `const baseUrl = "${ngrokUrl}"`
            );

            // Write the updated content back to constants.js
            fs.writeFileSync('constants.js', updatedData, 'utf8');
            console.log('constants.js updated successfully.');
        } else {
            console.log(`Keeping existing URL: ${currentBaseUrl}`);
        }

        console.log('Starting application...');

        // Start the application
        const app = spawn('node', ['app.js'], { stdio: 'inherit' });

        app.on('error', (err) => {
            console.error(`Failed to start application: ${err}`);
            process.exit(1);
        });

        rl.close();
    });
} catch (err) {
    console.error(`Error processing constants.js: ${err.message}`);
    rl.close();
    process.exit(1);
}