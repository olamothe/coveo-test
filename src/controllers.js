/*
	Coveo - Test App, controllers.js
	Date: Dec 27, 2016
*/

// Polyfill...
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(elt /*, from*/) {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0) ? Math.ceil(from) : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)  {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}
//--

var app = angular.module('coveoApp', []);

app.controller('searchPageCtrl', ["$scope", "$interval", "$timeout", "coveoAPIService", function($scope, $interval, $timeout, coveoAPIService) {
	
	$scope.coveoAPIService = coveoAPIService;
				
	// Setting the API key...
	coveoAPIService.setAPIKey("6318103b-f9da-437c-854b-9e6f1f44e27b");
	
	// Setting the filter fields...
	coveoAPIService.addGroupByField("category", "@tpcategorie", "occurrences", 5);
	coveoAPIService.addGroupByField("prix", "@tpprixbande", "occurrences", 5);
	coveoAPIService.addGroupByField("disponibilite", "@tpdisponibilite", "occurrences", 5);
	coveoAPIService.addGroupByField("format", "@tpformat", "occurrences", 5);
	coveoAPIService.addGroupByField("en special", "@tpenspecial", "occurrences", 5);
	coveoAPIService.addGroupByField("pays", "@tppays", "occurrences", 5);
	coveoAPIService.addGroupByField("region", "@tpregion", "occurrences", 5);
	coveoAPIService.addGroupByField("year", "@tpmillesime", "occurrences", 5);
	coveoAPIService.addGroupByField("bouchon", "@tpbouchon", "occurrences", 5);
	//coveoAPIService.addGroupByField("tpcoteexpertsplitgroup", "@tpcoteexpertsplitgroup", "AlphaDescending", 5);
	//coveoAPIService.addGroupByField("tpcepagenomsplitgroup", "@tpcepagenomsplitgroup", "occurrences", 5);
	//coveoAPIService.addGroupByField("tpclassification", "@tpclassification", "occurrences", 5);
	//coveoAPIService.addGroupByField("tppastilledegout", "@tppastilledegout", "occurrences", 5);
	//coveoAPIService.addGroupByField("tpfamilledevinsplitgroup", "@tpfamilledevinsplitgroup", "occurrences", 5);
	//coveoAPIService.addGroupByField("tpaccordsnommenu", "@tpaccordsnommenu", "AlphaDescending", 5);
	//coveoAPIService.addGroupByField("tpparticularitesplitgroup", "@tpparticularitesplitgroup", "occurrences", 5);
	//coveoAPIService.addGroupByField("tpobservationsgustativesacidite", "@tpobservationsgustativesacidite", "AlphaDescending", 5);
	//coveoAPIService.addGroupByField("tpobservationsgustativescorps", "@tpobservationsgustativescorps", "AlphaDescending", 5);
	//coveoAPIService.addGroupByField("tpobservationsgustativestannins", "@tpobservationsgustativestannins", "AlphaDescending", 5);
	//coveoAPIService.addGroupByField("tpobservationsgustativestexture", "@tpobservationsgustativestexture", "AlphaDescending", 5);
	
	// Page Ctrl Vars...
	$scope.query = "";
	$scope.currentPage = 1;
	$scope.loading = false;
	$scope.results = [];
	$scope.groupByResults = [];
	
	// Page Ctrl Funcs...
	$scope.changeResultsPerPage = function(num){
		coveoAPIService.setResultsPerPage(num);
		$scope.currentPage = 1;
		$scope.runQuery();
	};
		
	$scope.changeSort = function(sort){
		coveoAPIService.setSortOnCriteria(sort);
		$scope.currentPage = 1;
		$scope.reload();
	};
		
	$scope.loadPage = function(pg) {
		if( pg < 1 || pg > $scope.totalPages ) return;
		$scope.currentPage = pg;
		$scope.loading = true;
		coveoAPIService.search($scope.query, $scope.currentPage).then(
			function(succ) {
				$scope.loading = false;
				$scope.results = succ.results;
				$scope.totalCount = succ.totalCount;
				$scope.groupByResults = succ.groupByResults;
				$scope.totalPages = Math.ceil(succ.totalCount / coveoAPIService.getResultsPerPage() );
				
			}, function(err) {
				$scope.loading = false;
				alert("Problem:" + err);
			})
		;	
	};
		
	// Bounce results (made in qc)
	$scope.animate = function() {
		$interval.cancel($scope.timer);
		var divs = document.getElementsByClassName("madeinqc");
		
		$scope.timer = $interval(function() {
			var pulse = function(x) {
				angular.element( divs[x] ).addClass("animated pulse");
			};
			for( var x=0; x<divs.length; x++) {
				angular.element( divs[x] ).removeClass("animated pulse");
				$timeout(pulse, 1000 * (x % 7), true, x);
			}
		}, 1000 * 8);
	};
	$scope.animate();
	
	// Run the query	
	$scope.runQuery = function() {
		coveoAPIService.clearFilters();
		$scope.loading = true;
		coveoAPIService.search($scope.query, $scope.currentPage).then(
			function(succ) {
				$scope.loading = false;
				$scope.results = succ.results;
				$scope.totalCount = succ.totalCount;
				$scope.groupByResults = succ.groupByResults;
				$scope.totalPages = Math.ceil(succ.totalCount / coveoAPIService.getResultsPerPage() );
			}, function(err) {
				$scope.loading = false;
				alert("Problem:" + err);
			})
		;
	};
	$scope.runQuery();
	
	// Clear the query
	$scope.clear = function() {
		$scope.currentPage = 1;
		$scope.query = "";
		coveoAPIService.clearFilters();
		$scope.runQuery();
	};
	
	// Reload the results (w/ filters)
	$scope.reload = function() {
		$scope.loading = true;
		coveoAPIService.search($scope.query, 1).then(
			function(succ) {
				$scope.results = succ.results;
				$scope.totalCount = succ.totalCount;
				
				//loop succ.groupByResults
				var newgroupByResults = [];
				for( var x=0; x<succ.groupByResults.length; x++) {
					var active = coveoAPIService.isActiveFilter(succ.groupByResults[x].field);
					console.log("active=", succ.groupByResults[x].field, active);
					if(active) {
						newgroupByResults.push($scope.groupByResults[x]);
					} else {
						newgroupByResults.push(succ.groupByResults[x]);
					}		
				}
				
				$scope.groupByResults = newgroupByResults;				 
				$scope.loading = false;
				$scope.totalPages = Math.ceil(succ.totalCount / coveoAPIService.getResultsPerPage() );				
			}, function(err) {
				$scope.loading = false;
				alert("Problem:" + err);
			})
		;
	};
	
	// Suggest Service, OFF
	$scope.runSuggest = function(){
		coveoAPIService.suggest("abs").then(
			function(resp){
				console.log("succ=", resp);
			},function(resp){
				console.log("err=", resp);
			}
		);
	};
	$scope.runSuggest();
	
}]);