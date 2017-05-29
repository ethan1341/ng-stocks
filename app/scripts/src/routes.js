/**
 * $State routing(angular.ui) uses abstracts for inheritance
 */

angular.module("ngStocks")
    .config(function ($stateProvider) {
        $stateProvider
            .state("login", {
                url: "/login",
                controller: "loginController",
                templateUrl: "app/html/login.html"
            })
            .state("register", {
                url: "/register",
                controller: "registerController",
                templateUrl: "app/html/register.html"
            })
            .state("dashboard", {
                url: "/dashboard",
                abstract: true,
                controller: "dashboardController",
                templateUrl: "app/html/dashboard.html"
            })
            .state("dashboard.overview", {
                url: "/overview",
                controller: "dashboardOverviewController",
                templateUrl: "app/html/dashboard-overview.html"
            })
            .state("dashboard.portfolio", {
                url: "/portfolio",
                controller: "dashboardPortfolioController",
                templateUrl: "app/html/dashboard-portfolio.html"
            })
            .state("redirect", {
                url: "/redirect",
                controller: "redirectController",
                templateUrl: "app/html/login-redirect.html"
            })
            .state("error", {
                url: "/error",
                controller: "errorController",
                templateUrl: "app/html/error.html"
            });;
    });