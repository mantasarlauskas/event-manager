angular.module('myApp').controller('AdminFormCtrl', function($scope, $http){ 

    $scope.form = {};

    if(sessionStorage.getItem('admins')) {
        $scope.admins = JSON.parse(sessionStorage.getItem('admins'));
    } else {
        $http({
            method: 'GET',
            url: 'js/data.json' 
        }).then((response) => {
            $scope.admins = response.data.admins;
        })
    }

    function validatePasswords() {
        if($scope.form.firstPassword === $scope.form.secondPassword) {
            return true;
        }
        $scope.passwordError = true;
        return false;
    }

    function validateAdmin() {
        if(!$scope.admins[$scope.form.email]) {
            return true;
        }
        $scope.adminError = true;
        return false;
    }

    $scope.createAdmin = function() {  
        $scope.passwordError = false;
        $scope.adminError = false;
        if($scope.createAdminForm.$valid && validatePasswords() && validateAdmin()){
            $scope.admins[$scope.form.email] = {
                "password": $scope.form.firstPassword,
                "role": 0
            };
            sessionStorage.setItem('admins', JSON.stringify($scope.admins));
            $scope.$parent.hideCreateAdmin();
        }       
    }

});