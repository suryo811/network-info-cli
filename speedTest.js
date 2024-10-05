import got from 'got'
import config from './config.js'

// Function to test download speed
async function testDownloadSpeed() {
    const { url, size } = config.download;
    const fileUrl = `${url}?bytes=${size}`;
    const startTime = new Date().getTime();

    try {
        await got.get(fileUrl, {
            responseType: 'buffer', // We don’t need the actual data
        });

        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // In seconds
        const fileSizeInBits = size * 8; // File size in bits
        const speedMbps = (fileSizeInBits / duration) / (1024 * 1024); // Convert to Mbps
        return speedMbps;
    } catch (error) {
        console.error('Error testing download speed:', error.message);
        return 0; // In case of failure, return 0 speed
    }
}

// Function to test upload speed
async function testUploadSpeed() {
    const { url, size } = config.upload;
    const testData = Buffer.alloc(size, 'a');
    const startTime = new Date().getTime();

    try {
        await got.post(url, {
            body: testData,
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        });

        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // In seconds
        const fileSizeInBits = testData.length * 8; // File size in bits
        const speedMbps = (fileSizeInBits / duration) / (1024 * 1024); // Convert to Mbps
        return speedMbps;
    } catch (error) {
        console.error('Error testing upload speed:', error.message);
        return 0; // In case of failure, return 0 speed
    }
}

// Function to perform multiple tests and calculate average
async function runMultipleTests(testFunction, numTests) {
    let totalSpeed = 0;

    for (let i = 0; i < numTests; i++) {
        const speed = await testFunction();
        totalSpeed += speed;
    }

    const averageSpeed = totalSpeed / numTests;
    return averageSpeed;
}

// Main function to run tests and show results
async function runSpeedTest() {
    const numTests = 5;
    console.log('Tests are running, please wait...') //TODO:add spinner here

    try {
        const avgDownloadSpeed = await runMultipleTests(testDownloadSpeed, numTests);
        console.log(`Average Download Speed: ${avgDownloadSpeed.toFixed(2)} Mbps`);

        const avgUploadSpeed = await runMultipleTests(testUploadSpeed, numTests);
        console.log(`Average Upload Speed: ${avgUploadSpeed.toFixed(2)} Mbps`);
    } catch (error) {
        console.error('Error during speed test:', error.message);
    }
}

export { runSpeedTest }