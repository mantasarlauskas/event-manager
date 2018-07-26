angular.module('myApp').controller('LoginCtrl', function($scope, $http, $location, AclService){  
    
    function validateAdmin(admin) {
        if(admin && admin.password === $scope.password) {
            setadminRole(admin); 
        } else {
            $scope.loginError = true;
            $scope.loginForm.$submitted = false;
        } 
    }

    function setadminRole(admin) {
        AclService.flushRoles(); 
        if(admin.role === 1) {
            AclService.attachRole('superAdmin');
            sessionStorage.setItem('superAdmin', JSON.stringify(admin));
        } else {
            AclService.attachRole('admin');
            sessionStorage.setItem('admin', JSON.stringify(admin));
        }
        $location.path('/main').replace();
    } 
    
    $scope.submitLoginForm = () => {
        if($scope.loginForm.$valid) {
            if(sessionStorage.getItem('admins')) {
                validateAdmin(JSON.parse(sessionStorage.getItem('admins'))[$scope.email]);
            } else {
                $http({
                    method: 'GET',
                    url: 'js/data.json'            
                }).then((response) => {
                    validateAdmin(response.data.admins[$scope.email]);                      
                });
            }
            
        }
    } 
});