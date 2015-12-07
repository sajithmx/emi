/**
 * Created by sxmx7 on 11/30/2015.
 */

(function(){
    'use strict';

    angular.module('getLostApp', ['ngMaterial', 'ui.router'])
        .config( function($mdIconProvider, $mdThemingProvider, $urlRouterProvider, $stateProvider) {
        /* For more info, visit https://material.angularjs.org/#/Theming/01_introduction */

            $mdIconProvider
                .defaultIconSet("./assets/svg/avatars.svg", 128)
                .icon("menu"       , "./img/icons/ic_menu_black_24px.svg"        , 24)
                .icon("share"      , "./assets/svg/share.svg"       , 24)
                .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
                .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
                .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
                .icon("phone"      , "./assets/svg/phone.svg"       , 512);

        $mdThemingProvider.theme('default')
            .primaryPalette('light-green')
            .accentPalette('green')
            .warnPalette('red');


            $urlRouterProvider.otherwise('/tab/dash');
            $stateProvider
                .state('view1', {
                    url: "/loan-data",
                    templateUrl: "partials/view1.html"
                })
                .state('view2', {
                    url: "/emi-details",
                    templateUrl: "partials/view2.html"
                });


    }).controller('AppCtrl', function($scope, $log, $location) {



            $scope.loan = {
                loanType: 'home',
                amount: 1000,
                duration: 12,
                interestRate: 9
            };

            $scope.emis = {};
            $scope.emi = {};
            var counter = 1;

            //$scope.emis[counter] = $scope.emi;

            $scope.selectedIndex = 0;

            $scope.$watch('selectedIndex', function(current, old) {
                switch (current) {
                    case 0:
                        $location.url("/loan-data");
                        break;
                    case 1:
                        $location.url("/emi-details");
                        break;
                }
            });

            $scope.add = function(loan){
                counter++;

                var temp = {
                    loan: angular.copy($scope.loan),
                    emi: angular.copy($scope.emi)
                };

                $scope.emis[counter] = temp;

                $log.debug("$scope.emis:", $scope.emis);
            };

            $scope.calculate = function(project){

                $log.debug("loan:", loan);

                calculate();
            };

            //calculate();

            $scope.$watch(
                "loan",
                function handleFooChange( newValue, oldValue ) {
                    console.log( "loan.amount:", newValue );
                }
            );

            $scope.$watchCollection(
                "loan",
                function( newValue, oldValue ) {
                    console.log( "loan.amount:", newValue );
                    calculate();
                }
            );

            function calculate() {
                // Get the user's input from the form. Assume it is all valid.
                // Convert interest from a percentage to a decimal, and convert from
                // an annual rate to a monthly rate. Convert payment period in years
                // to the number of monthly payments.
                var principal = $scope.loan.amount;
                var interest = $scope.loan.interestRate / 100 / 12;
                var payments = $scope.loan.duration;

                // Now compute the monthly payment figure, using esoteric math.
                var x = Math.pow(1 + interest, payments);
                var monthly = (principal*x*interest)/(x-1);

                // Check that the result is a finite number. If so, display the results
                if (!isNaN(monthly) &&
                    (monthly != Number.POSITIVE_INFINITY) &&
                    (monthly != Number.NEGATIVE_INFINITY)) {

                    $scope.emi.id = counter;
                    $scope.emi.payment = round(monthly);
                    $scope.emi.total = round(monthly * payments);
                    $scope.emi.totalinterest =  round((monthly * payments) - principal);

                    $log.debug("$scope.emi:", $scope.emi);
                }
                // Otherwise, the user's input was probably invalid, so don't
                // display anything.
                else {
                    $scope.emi.id = counter;
                    $scope.emi.payment = "";
                    $scope.emi.total = "";
                    $scope.emi.totalinterest = "";
                }
            }

            // This simple method rounds a number to two decimal places.
            function round(x) {
                return Math.round(x*100)/100;
            }


        }).filter('orderObjectBy', function() {
            return function(items, field, reverse) {
                var filtered = [];
                angular.forEach(items, function(item) {
                    filtered.push(item);
                });
                filtered.sort(function (a, b) {
                    return (a[field] > b[field] ? 1 : -1);
                });
                if(reverse) filtered.reverse();
                return filtered;
            };
        });

})();