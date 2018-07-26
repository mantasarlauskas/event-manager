angular.module('myApp').controller('EventsCtrl', function($scope, AclService, events, $rootScope) { 

    $scope.today = new Date();
    $scope.can = AclService.can;
    $scope.pagination = {};
    $scope.pagination.eventsCurrentPage = 1;
    $scope.numPerPage = 10;

    if(sessionStorage.getItem("events")) {
        $scope.events = JSON.parse(sessionStorage.getItem("events"));
    } else {
        events.getEvents().then((data) => {
            $scope.events = data;
        })
    }

    function updateEventsData() {
        const begin = (($scope.pagination.eventsCurrentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        if(JSON.parse(sessionStorage.getItem('events'))) {
            $scope.events = JSON.parse(sessionStorage.getItem('events')).sort(events.getSortByDate);
            $scope.filteredEvents = $scope.events.slice(begin, end);
            $scope.pagination.eventsPageCount = Math.ceil($scope.events.length / $scope.numPerPage);
        }
    }

    $scope.$watch('pagination.eventsCurrentPage', () => {
        updateEventsData();
        $rootScope.$broadcast('events-page-changed');
    });

    $rootScope.$on('updateEventsData', () => {
        updateEventsData();
    })

    $scope.deleteEvent = (index, title) => {
        $scope.events.splice(index, 1);
        sessionStorage.setItem('events', JSON.stringify($scope.events));
        if(sessionStorage.getItem('participants')) {
            let participants = JSON.parse(sessionStorage.getItem('participants'));
            for (let i = participants.length - 1; i >= 0; i -= 1) {
                if(participants[i].event_id === title) {
                    participants.splice(i, 1);
                }
            }
            sessionStorage.setItem('participants', JSON.stringify(participants));
        }
        updateEventsData();
    }  

});