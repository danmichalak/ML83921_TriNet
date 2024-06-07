"use strict";

$(document).ready(function() {

    var statusControllers = angular.module("globalController", [])
        .controller("GlobalController", ["$scope","$cookies","$http","$filter", function ($scope, $cookies, $http, $filter) {

            $scope.xmp = {};

            $scope.currentDate = moment();

            $scope.setUrlCode = function() {

                var locParams = window.location.search.toLowerCase();

                $scope.url_code = "en";

                if (locParams.indexOf("lang=") !== -1) {
                    var start = locParams.indexOf("lang=") + 5;
                    var substr1 = locParams.substring(start);

                    if (substr1.indexOf("&") === -1) {
                        $scope.url_code = substr1;
                    } else {
                        var end = substr1.indexOf("&");
                        var substr2 = substr1.substring(0, end);
                        $scope.url_code = substr2;
                    }
                } else if ($cookies.hasOwnProperty("xmpUrlCode")) {
                    $scope.url_code = $cookies.xmpUrlCode.toUpperCase();
                }

                if ($scope.url_code !== "en" && $scope.url_code !== "es") {
                    $scope.url_code = "en";
                }

            };

            $scope.range = function(min, max, step) {
                // function for generating a range of numbers

                step = step || 1;
                var input = [];
                for (var i = min; i <= max; i += step) {
                    input.push(i);
                }

                return input;
            };

            $scope.getRate = function(data,obj) {

                // check input values against a list of rates

                var filterObj = {};

                // build the filter object by assigning the input value to the appriate rate-determining variables
                Object.keys(data[0]).forEach(function(key) {
                    if (key !== "rates") {
                        filterObj[key] = obj[key];
                    }
                });

                // uses the filter to find the data array item with the appropriate rate
                // this filter will return only one item in a properly-built data array, but it will still return an array with one item
                // instead, retrieving the only object in the array for easier formatting
                var item = $filter("filter")(data, filterObj, true)[0];

                return item.rates;
            };

            $scope.getJson = function (urlStr, callback) {
                $http.get(urlStr).then(function successCallback(response) {
                    callback(response);
                }, function errorCallback(response) {
                    alert(response.data);
                });
            };

        }]);

    // app
    var xmpApp = angular.module("xmp.app", [
        "globalController",
        "xmp.directives",
        "xmp.controllers",
        "xmp.services"
    ]).config(["xmpResourceProvider", function(inProvider) {
        // 	xmpcfg is defined externally at the site.
        inProvider.configure({
            access:xmpcfg.access
        });
    }]);

    // setting up jQuery functions
    //$("[data-toggle='popover']").popover();

    resizeHeader();
});

$(window).resize(function() {
    resizeHeader();
});

$(window).scroll(function() {
    resizeHeader();
});

var resizeHeader = function() {
    var pos = $(window).scrollTop();
    var wth = $(window).width();

    if (wth < 768 || pos > 7) {
        $(".global-header").addClass("global-header--minimized");
        $(".global-header__row").addClass("global-header__row--minimized");
        $(".global-header__left").addClass("global-header__left--minimized");
        $(".global-header__right").addClass("global-header__right--minimized");
        $(".global-header__logo-metlife").addClass("global-header__logo-metlife--minimized");
        $(".global-header__logo-sponsor").addClass("global-header__logo-sponsor--minimized");

        if (wth < 768) {
            $("body").css("padding-top", "90px");
        } else {
            $("body").css("padding-top", "50px");
        }
    } else {
        $("body").css("padding-top", "70px");
        $(".global-header").removeClass("global-header--minimized");
        $(".global-header__row").removeClass("global-header__row--minimized");
        $(".global-header__left").removeClass("global-header__left--minimized");
        $(".global-header__right").removeClass("global-header__right--minimized");
        $(".global-header__logo-metlife").removeClass("global-header__logo-metlife--minimized");
        $(".global-header__logo-sponsor").removeClass("global-header__logo-sponsor--minimized");
    }

};
