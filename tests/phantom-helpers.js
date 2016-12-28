/*
 * phantom-helpers.js (Nov 2, 2015)
 * Copyright 2015, http://codeeverywhere.ca
 * Licensed under the MIT license.
 * This helper function Module (includes 'clickOn' and 'waitForElemExists')
 */
module.exports = function() {

    this.clickOn = function(querySelector, cb) {

        // Get element position
        var pos = page.evaluate(function(query) {
            try {
                return document.querySelector(query).getBoundingClientRect();
            } catch (e) {
                return false;
            }
        }, querySelector);

        // If failed, return error
        if (pos === false) {
            cb(false, "Error with " + querySelector);
            // else, do click
        } else {
            page.sendEvent("click", pos.left + 1, pos.top + 1);
            cb(pos, false);
        }

    };

    this.waitingForElem = 0;

    this.waitForElemExists = function(querySelector, cb) {

        var maxLoops = 30;
        var timer;

        waitingForElem++;

        timer = setInterval(function() {
	         
            var elemEval = page.evaluate(function(query) {
	            try {
	                return document.querySelector(query);
                } catch (e) {
                    return false;
                }
            }, querySelector);

            // empty string?
            if (typeof elemEval == "string" && elemEval.length === 0)
                elemEval = false;
            //if (typeof elemEval == "object" && elemEval.innerText.length === 999)
            //    elemEval = false;

            // null?
            if (elemEval === null)
                elemEval = false;

            if (elemEval !== false || maxLoops === 0) {
                clearInterval(timer);
                waitingForElem--;

                if (maxLoops === 0) {
                    cb({
                        innerText: ""
                    }, "tries exhusted for " + querySelector);
                } else {
	                
	                setTimeout( cb, 2500, elemEval, false );
                }
            }
            maxLoops--;

        }, 500);
    };
};