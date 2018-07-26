angular.module('myApp').controller('MainCtrl', function($scope, $location, AclService){  

    function setHoursMinutes(time) {
        const arr = time.split(':');
        const hours = arr[0];
        const minutes = arr[1];
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    }
    
    function setFields(event, index) {
        Object.assign($scope.form, event);
        $scope.editEventID = index;
        $scope.editEvent = true;
        $scope.form.date = moment($scope.form.date);  
        $scope.form.start_time = moment(setHoursMinutes($scope.form.start_time));
        $scope.form.end_time = moment(setHoursMinutes($scope.form.end_time));
        $scope.form.registration_begin = moment($scope.form.registration_begin);
        $scope.form.registration_end = moment($scope.form.registration_end);
    }

    $scope.showParticipantsTable = (title) => {
        $scope.participantsTable = true;
        $scope.eventTitle = title;
    }

    $scope.hideParticipantsTable = () => {
        $scope.participantsTable = false;
    }

    $scope.showCreateEvent = () => {
        $scope.createEvent = true;
        $scope.editEvent = false;
        $scope.form = {};
    }

    $scope.hideCreateEvent = () => {
        $scope.createEvent = false;
    }
 
    $scope.showCreateAdmin = () => {
        $scope.createAdmin = true;
    }

    $scope.hideCreateAdmin = () => {
        $scope.createAdmin = false;
    }

    $scope.showEditEvent = (event, index) => {
        $scope.showCreateEvent();
        setFields(event, index);    
    }
    
    $scope.toggleTab = (class1, class2) => {
        document.querySelector('.' + class1).classList.add('tab-active');
        document.querySelector('.' + class2).classList.remove('tab-active');
        if(document.querySelector('.tab-1').classList.contains('tab-active')) {
            $scope.displayEvents = true;
        } else {
            $scope.displayEvents = false;
        }
    };

    $scope.toggleTab('tab-1', 'tab-2');  

    $scope.logout = () => {
        sessionStorage.removeItem('admin');
        sessionStorage.removeItem('superAdmin');
        AclService.flushRoles();
        AclService.attachRole('guest');
        $location.path('/login').replace();  
    }
    
});