/*
	Coveo - Test App, services.js
	Date: Dec 27, 2016
*/

// Main Coveo service...
app.service("coveoAPIService", ["$http", "$q", function($http, $q) {
	
	var URI = "https://cloudplatform.coveo.com/rest";
	
	var query = ""; // For history
		
	// Setting : API key
	var APIKey = "";
	var setAPIKey = function(key) {
		APIKey = key;
	};
	
	// Setting : Mange groupBy fields
	var groupByFields = [], groupByFieldsDetails = {};
	var addGroupByField = function(title, name, sort, limit){
		groupByFieldsDetails[name] = { title : title, sort : sort, limit : limit };
		groupByFields.push({ field : name, sortCriteria : sort, maximumNumberOfValues : limit });
	};
	var getGroupByFieldsDetails = function(field){
		return groupByFieldsDetails["@" + field] || {};
	};
	
	// Setting : Results per page
	var resultsPerPage = 15;
	var setResultsPerPage = function(num){
		if( num <= 0 ) num = 15;
		resultsPerPage = num;
	};
	var getResultsPerPage = function(){
		return resultsPerPage;
	};
		
	// Setting : Sort on
	var sortOnCriteria = "Relevancy", sortOnField = "";
	var setSortOnCriteria = function(sort){
		if( sort === "" || sort === "Relevancy" ) {
			sortOnCriteria = "Relevancy";
			sortOnField = "";
		} else {
			sortOnCriteria = "fieldascending";
			sortOnField = sort;
		}
	};
		
	// Helper : build filter string...
	var activeFilters = {};
	var AQString = function() {
		var aq = [];

		angular.forEach(activeFilters, function(value, key) {
			var len = value.length;

			if( len === 0 )
				;
			else if ( len === 1)
				this.push("(@" + key + "=\"" + value[0] + "\")");
			else
				this.push("(@" + key + "=(\"" + value.join('","') + "\"))");								
		}, aq);
		
		return aq.join(" ");
	};
		
	// Actions : Add a filter...
	var addFilter = function(field, val) {
		if( activeFilters[ field ] === undefined )
			activeFilters[ field ] = [val];
		else
			activeFilters[ field ].push(val);
	};
		
	// Action : Remove a filter...
	var removeFilter = function(field, val) {

		// Shouldn't happen, but if undefined ... return;
		if( activeFilters[ field ] === undefined ) return;
					
		// Find and Remove field...
		var index = activeFilters[ field ].indexOf(val);			
		if (index > -1)
			activeFilters[ field ].splice(index, 1);
	};
		
	// Action : Clear filters...
	var clearFilters = function() {
		activeFilters = {};
	};
		
	var isActiveFilter = function(field) {
		return activeFilters[ field ] !== undefined && activeFilters[ field ].length > 0;
	};
		
	// Run a search...
	var search = function(q, page) {
		query = q;
		
		// calc 'firstResult'
		var firstResult = (page-1) * resultsPerPage;
		
		return $http.post(URI + "/search?access_token=" + APIKey + "&enableDidYouMean=true", {
			q : q, sortCriteria	: sortOnCriteria, sortField : sortOnField, groupBy : groupByFields,
				numberOfResults : resultsPerPage, firstResult : firstResult, aq : AQString()
		}).then( handleSuccess, handleError );
	};
		
	// Get more fields in filter...
	var groupByFieldMore = function(name, sort, limit) {
		
		var queryOverride = query;
		if( !isActiveFilter(name) )
			queryOverride += " " + AQString();
			
		return $http.post(URI + "/search/values?access_token=" + APIKey + "&ignoreAccents=true", {
			field : "@"+name, sortCriteria : sort, maximumNumberOfValues : limit, queryOverride : queryOverride
		}).then( handleSuccess, handleError );
	};
	
	// Get query suggestion
	var suggest = function(q){
		return $http.get(URI + "/search/querySuggest?access_token=" + APIKey + "&q="+q+"&count=15")
			.then( handleSuccess, handleError );
	};
		
	var handleSuccess = function(resp) {
		return resp.data;
	};
	
	var handleError = function(){
		return $q.reject( "An unknown error occurred." );
	};
			
	return({
		setAPIKey 			: setAPIKey,
		
		addGroupByField 	: addGroupByField,
		getGroupByFieldsDetails: getGroupByFieldsDetails,
		
		setResultsPerPage 	: setResultsPerPage,
		getResultsPerPage 	: getResultsPerPage,
		setSortOnCriteria 	: setSortOnCriteria,
		
		addFilter 			: addFilter,
		removeFilter 		: removeFilter,
		clearFilters 		: clearFilters,
				
		isActiveFilter 		: isActiveFilter,
		
		search 				: search,
		suggest 			: suggest,
		
		groupByFieldMore 	: groupByFieldMore
	});
}]);