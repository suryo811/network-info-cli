#!/usr/bin/env node
import inquirer from 'inquirer';
import dotenv from 'dotenv'
dotenv.config();
import { logNetworkInfo } from './features/networkInfo.js'
import { runSpeedTest } from './features/speedTest.js'

// Function to display the interactive menu
async function mainMenu() {
    const choices = [
        { name: 'Network Info', value: 'networkInfo' },
        { name: 'Speed Test', value: 'speedTest' },
        { name: 'Exit', value: 'exit' }
    ];

    try {
        const answer = await inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'Select an option:',
                choices: choices
            }
        ]);

        switch (answer.selection) {
            case 'networkInfo':
                await logNetworkInfo();
                break;
            case 'speedTest':
                await runSpeedTest();
                break;
            case 'exit':
                console.log('Goodbye!');
                return;
            default:
                console.log('Invalid option!');
        }

        // Re-display the menu after the task is done
        await mainMenu();
    } catch (error) {
        console.error('Prompt was closed unexpectedly');
    }


}

// Listen for SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\nExiting the application... Goodbye!');
    process.exit(0); // Exit the application cleanly
});

// Start the CLI app
mainMenu();
