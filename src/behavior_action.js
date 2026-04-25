/**
 * Behavior Action Module
 * Focus: Decision making based on perceived features
 */

let stopFrameCount = 0;
const DETECTION_THRESHOLD = 3; // Robustness: Continuous detection required

function handlePerception(features, bleClient) {
    const hasParkingLine = features.some(f => f.type === 'parking_line');

    if (hasParkingLine) {
        stopFrameCount++;
        if (stopFrameCount >= DETECTION_THRESHOLD) {
            console.log("Parking line confirmed. Sending STOP command.");
            // [Task 3] BLE Trigger
            // bleClient.send({ command: 'STOP', duration: 3000 });
        }
    } else {
        stopFrameCount = 0;
    }
}

if (typeof module !== 'undefined') {
    module.exports = { handlePerception };
}
