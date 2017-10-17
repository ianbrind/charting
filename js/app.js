// $(function () {
	console.log("angular");
	
	"use strict";

	//Define Angular app
	// (function () {

		angular.module("app", [
			"ui.router",
			"angularSpectrumColorpicker",
			"angular-tour",
			"ui.sortable"
		]);

		angular.module("app")
			.run(function(tourConfig) {
				
				tourConfig.backDrop = true;
				tourConfig.margin = 12;
				tourConfig.scrollSpeed = 500;
			});

		angular.module("app")
			.config(function($stateProvider, $urlRouterProvider) {
				$urlRouterProvider.otherwise("/");

				$stateProvider
					.state("home", {
						url: "/",
						controller: "HomeCtrl",
						templateUrl: "views/home.html"
					})
					.state("menu", {
						url: "/menu",
						// controller: "MenuCtrl",
						templateUrl: "views/menu.html"
					})
					.state("chart-list", {
						url: "/chart-list",
						controller: "ChartListCtrl",
						templateUrl: "views/chart-list.html"
					});
			});

		angular.module("app")
			.run(function($rootScope) {
				
				$rootScope.$on("notify", function (message, data) {
					console.log(data);
				});
			});


		angular.module("app")
			.constant("ChartOptions", {
				types: {
					bar: [
						"bar",
						"horizontalBar",
						"line",
						"pie",
						"polarArea"
					]
				},
				default: {
					bar: {
						fill: "rgb(51,122,183)",
						presets: {
							day_of_week: {
								title: "Day of Week",
								labels: [
									"Monday",
									"Tuesday",
									"Wednesday",
									"Thursday",
									"Friday",
									"Saturday",
									"Sunday",
								]
							},
							months:{
								title: "Months",
								labels:  [
									"January",
									"February",
									"March",
									"April",
									"May",
									"June",
									"July",
									"August",
									"September",
									"October",
									"November",
									"December",
								] 
							},
							time_of_day: {
								title: "Time of Day",
								labels: [
									"Morning",
									"Afternoon",
									"Evening",
								]
							}
						}
					}
				}
			})
	// })();

	// (function () {

		angular.module("app")
			.service("StorageSvc", function () {

				var storage = window.localStorage;

				//Save an item into the database
				this.save = function (item) {

					var charts = JSON.parse(storage.getItem("charts")) || [];

					charts.unshift(item);

					storage.setItem("charts", JSON.stringify(charts));
				};

				this.getList = function () {
					return JSON.parse(storage.getItem("charts"));
				};


			});

		angular.module("app")
			.controller("ChartListCtrl", function ($scope, StorageSvc) {

				$scope.charts = StorageSvc.getList();
				console.log($scope.charts);

			});
	
		angular.module("app")
			.controller("HomeCtrl", function ($scope, ChartOptions, StorageSvc, tourConfig) {

				var dom_canvas = $("#chart")[0];
				var dom_ctx = dom_canvas.getContext("2d");
				var chart = null;


				
				$scope.chart = {
					description: "",
					type: "bar",
					data: {
						labels: [],
						datasets: [{
							label: "",
							data: [],
							backgroundColor: []
						}]	
					},
					options: {
						scales: {
							yAxes: [
								{
									ticks: {
										beginAtZero: true
									}
								}
							],
							xAxes: [
								{
									ticks: {
										beginAtZero: true
									}
								}
							]
						},
						title: {
			            	display: true,
			            	text: ""
			        	}

					}
					
				}

				// (function () {

					$scope.sortableOptions = {

						stop: function (x, y, z) {
					  	
					  		console.log("stop")
					  		console.log($scope.chart.data)

						},
					  	start: function (x, y, z) {

					  		console.log($scope.chart.data)

					  		previous_order = $scope.chart.data.labels;
					  		for(var i = 0, max = $scope.chart.data.labels.length; i < max; i++) {

					  		}
						}
					};
				// })();
				
				$scope.ui = {
					new_label: "",
					default_fill: ChartOptions.default.bar.fill,
					chart_types: ChartOptions.types.bar,
					label_presets: ChartOptions.default.bar.presets,
					selected_preset: ""
				}
				
				//Called when a label preset is selected.
				//Will clear the current labels and data values
				$scope.labelPresetSelected = function () {

					var data = $scope.chart.data;
					var dataset = data.datasets[0];
					//Get the labels for the preset
					var labels = _.find($scope.ui.label_presets, {title: $scope.ui.selected_preset.title}).labels;
	
					//Assign the new labels
					data.labels = labels;
					
					//Clear the values
					dataset.data = [];
					//Reset the colours
					dataset.backgroundColor = [];
					
					//Reset the data fields back to their default.
					for (var i = 0, max = data.labels.length; i < max; i++) {
						dataset.data[i] = 0;
						dataset.backgroundColor[i] = $scope.ui.default_fill;
					}

					//Clear the preset
					$scope.ui.selected_preset = null;
				};

				//Remove the label and all of the data points and properties associated with
				//that label
				$scope.removeLabel = function (index) {
					var data = $scope.chart.data; 
					data.datasets[0].data.splice(index, 1);
					data.datasets[0].backgroundColor.splice(index, 1);
					data.labels.splice(index, 1);
				};		

				$scope.addLabel = function () {
					
					if ($scope.chart.data.labels.indexOf($scope.ui.new_label) !== -1) {
						$scope.$emit("notify", "Label already exists in set.");
						return;
					}
					$scope.chart.data.labels.push($scope.ui.new_label);

					$scope.ui.new_label = "";
				};

				//Render/Re-Render the graph
				$scope.render = function () {
					
					console.log("$scope.chart");
					console.log($scope.chart);
					//Have to make a deep copy as chart-js modifies the config object passed in
					//this breaks when we change chart type, so we create a deep copy and pass that 
					//to chart-js instead.	
					var tmp_config = $.extend(true, {}, $scope.chart); 
					//Check if chart already exists
					if (chart) {
						chart.destroy();
					}
					chart = new Chart(dom_ctx, tmp_config);		
				};	

				$scope.save = function () {
					StorageSvc.save($scope.chart);
				};
			});
		
	// })();
 // });