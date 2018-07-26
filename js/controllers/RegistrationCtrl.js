angular.module('myApp').controller('RegistrationCtrl', function($scope, $filter, $cookies, events){

    $scope.formData = {};
    $scope.form = $cookies.getObject('userData') ? $cookies.getObject('userData') : {};
    $scope.today = $filter('date')(new Date(), 'yyyy-MM-dd');

    if(sessionStorage.getItem('events')) {
        $scope.events = JSON.parse(sessionStorage.getItem('events')).sort(events.getSortByDate);;
    } else {
        events.getEvents().then((data) => {
            if(data) {
                $scope.events = data.sort(events.getSortByDate);
            }
        })
    }
 
    function addParticipant() {
        let participants = sessionStorage.getItem('participants') ? JSON.parse(sessionStorage.getItem('participants')) : [], eventID;
        participants.push($scope.form);
        sessionStorage.setItem('participants', JSON.stringify(participants));
        $scope.events.forEach((cur, i) => {
            if(cur.title === $scope.form.event_id) {
                eventID = i;
            }
        })
        $scope.events[eventID].count++;
        sessionStorage.setItem('events', JSON.stringify($scope.events));
    }
        
    $scope.submitRegistrationForm = () => {
        if($scope.formData.registrationForm.$valid) {
            if($scope.formData.rules) {
                $scope.form.news = $scope.formData.news ? 1 : 0;    
                if(sessionStorage.getItem('cookiesSave')) {
                    $cookies.putObject('userData', $scope.form);
                }
                addParticipant();
                $scope.registrationSuccess = 1; 
            } else {
                $scope.registrationSuccess = 0;
            }
        }       
    }
});