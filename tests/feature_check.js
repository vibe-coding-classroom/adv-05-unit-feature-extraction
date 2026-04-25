/**
 * Feature Check Test Script (Autograder Version)
 */

const fs = require('fs');
const path = require('path');

// Mock OpenCV for Node.js environment
global.cv = {
    Mat: class { delete() {} },
    cvtColor: () => {},
    GaussianBlur: () => {},
    Canny: () => {},
    contourArea: (c) => c.area,
    arcLength: (c, closed) => c.perimeter,
    COLOR_RGBA2GRAY: 0,
    Size: class { constructor(w, h) { this.w = w; this.h = h; } }
};

const { calculateRoundness } = require('../src/contour_analyzer');
const { handlePerception } = require('../src/behavior_action');

const args = process.argv.slice(2);

function checkDenoise() {
    const filePath = path.join(__dirname, '../src/edge_processor.js');
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for GaussianBlur call (uncommented)
    const lines = content.split('\n');
    const hasGaussianBlur = lines.some(line => /^\s*cv\.GaussianBlur\s*\(/.test(line));

    if (hasGaussianBlur) {
        console.log("PASSED: Denoising implementation found");
    } else {
        console.log("FAILED: No GaussianBlur call detected in edge_processor.js");
        process.exit(1);
    }
}

function checkRoundness() {
    // Mock contour: Area = 100, Perimeter = Math.sqrt(4 * PI * 100) -> Roundness = 1.0
    const mockCircle = { area: 100, perimeter: Math.sqrt(400 * Math.PI) };
    const roundness = calculateRoundness(mockCircle);
    
    if (Math.abs(roundness - 1.0) < 0.01) {
        console.log("PASSED: Roundness formula is correct");
    } else {
        console.log(`FAILED: Roundness calculation incorrect. Expected ~1.0, got ${roundness}`);
        process.exit(1);
    }
}

function checkStability() {
    let commandsSent = 0;
    const mockBle = {
        send: () => { commandsSent++; }
    };
    
    const features = [{ type: 'parking_line' }];
    
    // Test debouncing: should not send command on 1st or 2nd frame
    handlePerception(features, mockBle);
    handlePerception(features, mockBle);
    
    if (commandsSent > 0) {
        console.log("FAILED: Command sent too early (no debouncing)");
        process.exit(1);
    }
    
    // Should send on 3rd frame (based on DETECTION_THRESHOLD in behavior_action.js)
    handlePerception(features, mockBle);
    
    if (commandsSent === 1) {
        console.log("PASSED: Stability logic confirmed");
    } else {
        console.log(`FAILED: Expected 1 command after 3 frames, got ${commandsSent}`);
        process.exit(1);
    }
}

// Main execution logic based on flags
if (args.includes('--check-denoise')) {
    checkDenoise();
} else if (args.includes('--check-roundness')) {
    checkRoundness();
} else if (args.includes('--check-stability')) {
    checkStability();
} else {
    console.log("Running all tests...");
    try {
        checkDenoise();
        checkRoundness();
        checkStability();
        console.log("All local checks passed!");
    } catch (e) {
        console.error("Some checks failed. Please review your implementation.");
        process.exit(1);
    }
}
