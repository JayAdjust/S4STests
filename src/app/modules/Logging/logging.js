import { _ } from '../Start/start_controller';

let browser;
let totalTestsFailed = 0;
let totalTests = 0;

function print(msg) {
    process.stdout.write(msg);
}

function printLine(msg) {
    console.log(msg);
}

function debugVariable(v) {
	printLine("");
	printLine("=====DEBUGGING VARIABLE=====");
	printLine(v);
	printLine("=====DEBUGGING VARIABLE ENDED=====");
	printLine("");
}

function endTestSequence(category, numTests, numFailed) {
	printLine("=====ENDING TESTS IN CATEGORY: '" + category + "'=====");
	printLine("  - " + (numTests - numFailed) + " out of " + numTests + " passed");

	if (numFailed > 0) {
		printLine("  - NOT GOOD!");
	} else {
		printLine("  - All good! :)");
    }
    
    // store statistics
    totalTests += numTests;
    totalTestsFailed += numFailed;
}

function endAllTests() {
    browser = _.GetBrowser();

    printLine("");
    printLine("=====ENDED ALL TESTS=====");
    printLine("  - Total Tests: " + totalTests);
    printLine("  - Tests Passed: " + (totalTests - totalTestsFailed));
    printLine("  - Failed tests: " + totalTestsFailed);

    if (totalTestsFailed > 0) {
		printLine("  - NOT GOOD! You still have work to do!");
	} else {
		printLine("  - All good! You can take it easy for today :)");
    }

    browser.close();
}

export const Log = {
    printLine: (msg) => {
	    printLine(msg);
    },
    print: (msg) => {
	    process.stdout.write(msg);
    },
    debugVariable: (v) => {
	    printLine("");
	    printLine("=====DEBUGGING VARIABLE=====");
	    printLine(v);
	    printLine("=====DEBUGGING VARIABLE ENDED=====");
        printLine("");
    },
    startTestSequence: (category) => {
	    printLine("");
	    printLine("=====STARTING TESTS IN CATEGORY: '" + category + "'=====");
    },
    startTest: (testNumber, testMessage)=> {
	    print("  - Case #" + testNumber + ": " + testMessage + "...");
    },
    testPassed: () => {
	    printLine(" passed!");
    },
    testFailed: (reason) => {
	    printLine(" FAILED!");
	    printLine("    - " + reason);
    },
    endTestSequence: (category, numTests, numFailed) => {
        endTestSequence(category, numTests, numFailed);
    },
    endAllTests: () => {
        endAllTests();
    }
}