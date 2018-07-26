angular.module('myApp').controller('CookieCtrl', function($scope){ 

    $scope.allowCookies = () => {
        sessionStorage.setItem('cookiesHide', true);
        sessionStorage.setItem('cookiesSave', true);
    }

    $scope.checkCookies = () => sessionStorage.getItem('cookiesHide');

    $scope.hideCookies = () => {
        sessionStorage.setItem('cookiesHide', true);
    }

});