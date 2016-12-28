/*
	Coveo - Test App, directives.js
	Date: Dec 27, 2016
*/

// Filter directive...
app.directive("filterBox", ["coveoAPIService", function(coveoAPIService) {
	return {
		restrict	: 'A',
		scope		: { 
			model : "=",
			reload : "&"
		},
		/*jshint -W043 */
		template	: '<div class="filter-box" ng-hide="model.values.length == 0">\
			<div class="top-right-btn">\
				<a href="#/" ng-click="display = !display">\
					<i class="fa" ng-class="{ \'fa-minus\' : display, \'fa-plus\' : !display }"></i>\
				</a>\
			</div>\
			<div class="title">{{ title }}</div>\
				<div ng-show="display">\
				<ul>\
					<li ng-repeat="attr in model.values" ng-init="attr.selected = (attr.selected || false)">\
						<a ng-click="select(attr)" href="#/">\
							<i class="fa" ng-class="{ \'fa-square-o\' : !attr.selected, \'fa-check-square\' : attr.selected }"></i>\
								{{ attr.value }} <span>{{ attr.numberOfResults | number }}</span></a>\
					</li>\
				</ul>\
				<a ng-hide="hideMoreBtn" ng-click="loadMore()" href="#/" class="more">more</a>\
			</div>\
		</div>',
		link 		: function(scope, elem, attrs){
			
			var details = coveoAPIService.getGroupByFieldsDetails(scope.model.field);			
			scope.title = details.title;
			
			// Do we show the more btn?				
			if( scope.model.values.length < details.limit )
				scope.hideMoreBtn = true;
			else
				scope.hideMoreBtn = false;
			
			// Are we hiding by default?
			if( attrs.hide === undefined || attrs.hide == "false" )
				scope.display = true;
			else
				scope.display = false;
			
			// Load more btn...
			scope.loadMore = function() {
				var limit = scope.model.values.length + details.limit;
				coveoAPIService.groupByFieldMore(scope.model.field, details.sort, limit).then(
					function(succ) {
						//- hide more btn?
						if( scope.model.values.length == succ.values.length || succ.values.length%details.limit !== 0 )
							scope.hideMoreBtn = true;
						
						scope.model.values = succ.values;
						
						for( var x=0; x<scope.model.values.length; x++ ) {
							var attr = scope.model.values[x].value;
							console.log(scope.selectedMemory, attr, scope.selectedMemory[attr]);
							if( scope.selectedMemory[attr] )
								scope.model.values[x].selected = true;
						}
					},
					function(err) {
						alert("Problem:" + err);
					}
				);
			};
				
			// Select a filter...
			scope.selectedMemory = {};
			scope.select = function(attr){
				attr.selected = !attr.selected;
				scope.selectedMemory[attr.value] = attr.selected;
				
				if( attr.selected )
					coveoAPIService.addFilter(scope.model.field, attr.value);
				else
					coveoAPIService.removeFilter(scope.model.field, attr.value);
					
				scope.reload();
			};
		}
	};
}]);


// Enter button action (from docs)...
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});