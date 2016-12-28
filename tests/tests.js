/*
	Coveo - Test App, tests.js
	Date: Dec 27, 2016
*/

var page = require('webpage').create();

page.viewportSize = { width: 1200, height: 768*2 };

require('./phantom-helpers')();
require('./testing')();

var url = 'http://codeeverywhere.ca/coveo-test/';
page.open(url, function (status) {
	
	console.log("status=", status);
	
	describe("opening the page", function(it) {
	    it("should be successful", function(expect) {
			expect(status).toEqual("success");
	    });
	    
		it("should have default 15 results", function(expect) {
			waitForElemExists(".result-box", function(elem, err) {
				if (err) console.log("err=", err);
				
				var count = page.evaluate(function() {
					return document.getElementsByClassName("result-box").length;
				});
				
				expect(count).toEqual(15);
				
				testQuery();
			});
		});
	});
	
	
	var testQuery = function() {
		
		describe("running a query", function(it) {
		
			clickOn('.search-field input', function(pos, err) {
		    	if (err) console.log("err=", err);
		    					
				page.sendEvent('keypress', "xxxx");
				
				clickOn('.run', function(e, err) {
					if( err ) console.log("err=", err);
				});
				
				waitForElemExists(".empty", function(elem, err) {
					if (err) console.log("err=", err);
										
					var text = elem.innerText.trim();
									
					it("should display message when 0 results", function(expect) {
						expect( text ).toEqual("Sorry, No Results Found.");
					});
					
					// clear search box
					clickOn('.clear', function(e, err) {
						if( err ) console.log("err=", err);
					});
					
					clickOn('.search-field input', function(pos, err) {
						if (err) console.log("err=", err);
		    					
						page.sendEvent('keypress', "vodka");
				
						clickOn('.run', function(e, err) {
							if( err ) console.log("err=", err);
						});
				
						waitForElemExists(".fa-search", function(elem, err) {
							if (err) console.log("err=", err);
							
							var count = page.evaluate(function() {
								return document.getElementsByClassName("result-box").length;
							});
				
							it("should display 15 results, Query: vodka", function(expect) {
								expect(count).toEqual(15);
							});
							
							testOptions();
						});
						
					});
				
				});				
				
			});
	    
		});
		
	}; // end: next()
	
	
	var testOptions = function() {
		
		describe("results options", function(it) {
			
			clickOn('.per-page a:nth-child(2)', function(pos, err) {
				
				if (err) console.log("err=", err);
				
				waitForElemExists(".content a:nth-child(30)", function(elem, err) {
					
					if (err) console.log("err=", err);
					
					it("should change to 30 results", function(expect) {
						
						var count = page.evaluate(function() {
							return document.getElementsByClassName("result-box").length;
						});
						
						expect(count).toEqual(30);
					
					});
					
					clickOn('.right.per-page a:nth-child(2)', function(pos, err) {
						
						if (err) console.log("err=", err);
						
						waitForElemExists(".fa-search", function(elem, err) {
							
							if (err) console.log("err=", err);
							
							it("should change to sort by price (price1 < price2 )", function(expect) {
							
								var price1 = page.evaluate(function() {
									return parseFloat(document.getElementsByClassName("result-box")[0]
										.getElementsByClassName("prix")[0].innerText.replace("$", "").trim())
								});
								
								var price2 = page.evaluate(function() {
									return parseFloat(document.getElementsByClassName("result-box")[29]
										.getElementsByClassName("prix")[0].innerText.replace("$", "").trim())
								});
							
								expect(price1 < price2).toEqual(true);
								
								clickOn('.clear', function(e, err) {
									
									if( err ) console.log("err=", err);
									
									testNextPage();
								});
								
								
							
							});
																				
						});
												
				    });
				
				});
				
			});

	    });
		
	}; // end: testOptions()
	
	
	var testNextPage = function() {
		
		describe("next page test", function(it) {
													
			var prevResult = page.evaluate(function() {
				return document.getElementsByClassName("result-box")[0]
					.getElementsByClassName("sub")[2].innerHTML;
			});
			
			it("should show the next page", function(expect) {
																		
				clickOn('.pages-footer a:nth-child(1)', function(pos, err) {
					
					if (err) console.log("err=", err);
														
					page.sendEvent("click", pos.left + 20, pos.top + 12);
					
					setTimeout(function() {
					
						//page.render('1click.png');
																	
						waitForElemExists(".fa-search", function(elem, err) {
							
							if (err) console.log("err=", err);
							
							waitForElemExists(".result-box", function(elem, err) {
								
								if (err) console.log("err=", err);
									
								//page.render('3results.png');
								
								var result = page.evaluate(function() {
									return document.getElementsByClassName("result-box")[0]
										.getElementsByClassName("sub")[2].innerHTML;
								});
								
								console.log("Sample: ", prevResult, result);
								
								expect( prevResult != result ).toEqual(true);
								
								testFilters();
							
							});
						});
						
					}, 3000);
						
				});
			});	
		});
	};
	
	
	
	var testFilters = function() {
		
		describe("selecting filters", function(it) {
			
			// clear search box
			clickOn('.clear', function(e, err) {
				
				if( err ) console.log("err=", err);
				
				waitForElemExists(".fa-search", function(elem, err) {
				
					clickOn('.search-field input', function(pos, err) {
						
						if (err) console.log("err=", err);
						
						page.sendEvent('keypress', "vodka");
						
						clickOn('.run', function(e, err) {
							
							//page.render('241.png');
						
							if( err ) console.log("err=", err);
						
							waitForElemExists(".fa-search", function(elem, err) {
							waitForElemExists(".result-box", function(elem, err) {
								
								//page.render('248.png');
										
								it("should display filtered results for 'Liqueur'", function(expect) {
									
									clickOn('.filter-box:nth-child(1) ul li:nth-child(2) a', function(pos, err) {
										
										if (err) console.log("err=", err);
										
										waitForElemExists(".fa-search", function(elem, err) {
											
											if (err) console.log("err=", err);
											
											waitForElemExists(".result-box", function(elem, err) {
												
													var results = page.evaluate(function() {
														return [
															document.getElementsByClassName("result-box")[0].getElementsByClassName("sub")[0].innerHTML,
															document.getElementsByClassName("result-box")[1].getElementsByClassName("sub")[0].innerHTML,
															document.getElementsByClassName("result-box")[2].getElementsByClassName("sub")[0].innerHTML,
															document.getElementsByClassName("result-box")[3].getElementsByClassName("sub")[0].innerHTML,
															document.getElementsByClassName("result-box")[4].getElementsByClassName("sub")[0].innerHTML
														];
													});
												
													console.log("Sample:", JSON.stringify(results) );
													
													expect( results[0].match(/liqueur/i) !== null ).toEqual(true);
													expect( results[1].match(/liqueur/i) !== null ).toEqual(true);
													expect( results[2].match(/liqueur/i) !== null ).toEqual(true);
													expect( results[3].match(/liqueur/i) !== null ).toEqual(true);
													expect( results[4].match(/liqueur/i) !== null ).toEqual(true);
													
													//---
													printTestResults();
											        phantom.exit();
											        
											});
										});
									});	
								});
								});
							});
						});
					});
				});
				
		    });
		
		});
		
	};// end: testFilters()

});