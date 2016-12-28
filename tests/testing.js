/*
 * testing.js (Aug 23 2015)
 * Copyright 2015, http://codeeverywhere.ca
 * Licensed under the MIT license.
 */
module.exports = function() {

    this.testsRunning = 0;
    this.testsPass = 0;
    this.testsFail = 0;

    var verbose = true; // Use console.log output
    var testResults = []; // Results Array
    var startTime = new Date().getTime(); // Start time in ms
    var endTime = -1; // Runtime of tests in ms

    this.testTime = endTime;

    this.printTestResults = function() {
        console.log("\n*** Tests Completed, Results: " + testsRunning + " tests run, \033[32m" + testsPass +
            " PASS, \033[31m" + testsFail + " FAIL\033[39m in " + (endTime / 1000) + "s");
    };

    this.describe = function(description, fn) {

        if (verbose)
            console.log("\nDescribe: " + description);

        var it = function(does, fn) {
            var _this = this;
            this.testsRunning += ("" + fn).match(/expect\(/gi).length;
            //console.log("it=", this.testsRunning, fn+"");

            if (verbose)
                console.log("\tIt: " + does);

            var expect = function(equals) {
                return ({
                    toEqual: toEqual,
                    toBe: toEqual,
                    toFail: toFail
                });

                function toEqual(expected) {
                    var pass = (expected == equals) ? "PASS" : "FAIL";
                    var color = (expected == equals) ? 2 : 1;

                    if (verbose)
                        console.log("  \033[3" + color + "m" + pass + "\033[39m\t\tTest: (expected, equals) => (" +
                            expected + ", " + equals + ")");

                    testResults.push({
                        describe: description,
                        it: does,
                        expected: expected,
                        equals: equals,
                        result: expected == equals
                    });

                    if (expected == equals)
                        testsPass++;
                    else
                        testsFail++;

                    endTime = (new Date().getTime()) - startTime;
                    return this;
                }

                function toFail(because) {

                    if (verbose)
                        console.log("    Test: ", "Result:", false, " ... " + because);

                    testResults.push({
                        describe: description,
                        it: does,
                        expected: "-",
                        equals: "... " + because,
                        result: false
                    });

                    testsFail++;
                    endTime = (new Date().getTime()) - startTime;
                    return this;
                }
            };
            fn(expect);
        };
        fn(it);
    };
};