angular.module('myApp').controller('EventFormCtrl', function($scope, $http, events, $rootScope){ 
    
    let eventsList =  sessionStorage.getItem('events') ? JSON.parse(sessionStorage.getItem('events')) : [];
    eventsList = eventsList.sort(events.getSortByDate);
    $scope.today = new Date();
    $scope.minParticipantsLength = 2;
    $scope.form = !$scope.form ? {} : $scope.form;

    function formValidation() {
        if($scope.today >= $scope.form.date) {
            return false;
        }
        if($scope.form.start_time >= $scope.form.end_time) {
            return false;
        }
        if($scope.form.registration_end >= $scope.form.date) {
            return false;
        }
        if($scope.form.registration_begin >= $scope.form.registration_end || 
            $scope.form.registration_begin >= $scope.form.registration_end) {
            return false;
        }
        return true;
    }

    function setTimeDate() {
        $scope.form.date = $scope.form.date.format('YYYY-MM-DD');
        $scope.form.start_time = $scope.form.start_time.format('HH:mm');
        $scope.form.end_time = $scope.form.end_time.format('HH:mm');
        $scope.form.registration_begin = $scope.form.registration_begin.format('YYYY-MM-DD');
        $scope.form.registration_end = $scope.form.registration_end.format('YYYY-MM-DD');
    }

    function validateEventTitle(event_id) {
        for(let index in eventsList) {
            if(eventsList[index].title === $scope.form.title && event_id !== parseFloat(index)) {
                $scope.titleError = true;
                return false;
            }
        }
        return true;
    }

    function addEvent() {
        $scope.form.count = 0;
        eventsList.push($scope.form);
        sessionStorage.setItem('events', JSON.stringify(eventsList));
    }

    function editEvent() {
        if(sessionStorage.getItem('participants')) {
            let participants = JSON.parse(sessionStorage.getItem('participants'))
            participants.forEach((cur) => {
                if(cur.event_id === eventsList[$scope.editEventID].title) {
                    cur.event_id = $scope.form.title;
                }
            });
            sessionStorage.setItem('participants', JSON.stringify(participants));
        }
        eventsList[$scope.editEventID] = $scope.form;
        sessionStorage.setItem('events', JSON.stringify(eventsList));
    }
    
    $scope.createEvent = () => {
        $scope.titleError = false;
        if($scope.eventForm.$valid && formValidation() && validateEventTitle()){
            setTimeDate();
            addEvent();
            $scope.$parent.hideCreateEvent();
            $rootScope.$emit('updateEventsData', {});
        }
    }

    $scope.updateEvent = () => {
        $scope.titleError = false;
        if($scope.eventForm.$valid && formValidation() && validateEventTitle($scope.editEventID)){
            setTimeDate();
            editEvent();      
            $scope.$parent.hideCreateEvent();  
            $rootScope.$emit('updateEventsData', {});
        }
    }

});