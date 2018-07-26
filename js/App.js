
const app = angular.module('myApp', ['ngRoute', 'angular-jwt', 'mm.acl', 'ng-pagination', 'ngCookies', 'moment-picker']);

app.config(($routeProvider, $locationProvider) => {
    $routeProvider
        .when('/register', {
            templateUrl: 'registration.html',
            controller: 'RegistrationCtrl',
            resolve : {
                'acl' : ($q, AclService) => AclService.can('login') ? true :  $q.reject('LoggedIn')
            }
        })
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginCtrl',
            resolve : {
                'acl' : ($q, AclService) => AclService.can('login') ? true :  $q.reject('LoggedIn')
            }
        })
        .when('/main', {
            templateUrl: 'main.html',
            controller: 'MainCtrl',
            resolve : {
                'acl' : ($q, AclService) => AclService.can('view_events') ? true : $q.reject('Unauthorized')
            }
        })
        .otherwise({
            redirectTo: '/register'
        });
    $locationProvider.html5Mode(true);
});

app.run(($rootScope, $location, AclService, $cookies) => {

    const aclData = {
        guest: ['login'],
        admin: ['view_events', 'create_event'],
        superAdmin: ['view_events', 'create_admin']
    }
    AclService.setAbilities(aclData);

    if(sessionStorage.getItem('admin')) {
        AclService.attachRole('admin');
    } else if (sessionStorage.getItem('superAdmin')) {
        AclService.attachRole('superAdmin');
    } else {
        AclService.attachRole('guest');
    }

    $rootScope.$on('$routeChangeError', (event, current, previous, rejection) => {
        rejection === 'Unauthorized' &&  $location.path('/login');
        rejection === 'LoggedIn' && $location.path('/main');
    });
    
    if($cookies.getObject('userData')) {
        sessionStorage.setItem('cookiesHide', true);
    }

});

app.factory('events', function($http){
    return {
        getEvents: () => {
            return $http({
                method: 'GET',
                url: 'js/data.json' 
            }).then((response) => {
                if(response.data.events) {
                    sessionStorage.setItem('events', JSON.stringify(response.data.events));
                }
                return response.data.events;
            });
        },
        getSortByDate: (obj1, obj2) => {
            if (obj1.date > obj2.date) return -1;
            if (obj1.date < obj2.date) return 1;
            if (obj1.title < obj2.title) return -1;
            if (obj1.title > obj2.title) return 1;
            return 0;
        }
    };
});

app.directive('tableRow', () => {
    return {
        restrict: 'A',
        controller: ($scope) => { 

            $scope.$on('events-page-changed', () => {
                $scope.details = false;
                $scope.description = false;
            });
           
            $scope.showMore = () => {
                $scope.description = true;
            }

            $scope.showLess = () => {
                $scope.description = false;
            }

            $scope.showDetails = () => {
                $scope.details = true;
            }

            $scope.hideDetails = () => {
                $scope.details = false;
            }

        },
        templateUrl: 'includes/event.html'
    };
});

app.directive('participantRow', () => {
    return {
        restrict: 'A',
        controller: ($scope) => {
            
            $scope.$on('participants-page-changed', () => {
                $scope.participantDetails = false;
            });

            $scope.showDetails = () => {
                $scope.participantDetails = true;
            }

            $scope.hideDetails = () => {
                $scope.participantDetails = false;
            }

        },
        templateUrl: 'includes/participant.html'
    };
});