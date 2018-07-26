angular.module('myApp').controller('ParticipantsCtrl', function($scope, AclService, events, $rootScope) { 

    $scope.can = AclService.can;
    $scope.pagination = {};
    $scope.numPerPage = 10;
    $scope.pagination.participantsCurrentPage = 1;
    
    function updateParticipantsData()  {
        if(sessionStorage.getItem('participants')) {
            const begin = (($scope.pagination.participantsCurrentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
            $scope.participants = JSON.parse(sessionStorage.getItem('participants'));
            $scope.filteredParticipants = $scope.participants.slice(begin, end);
            $scope.pagination.participantsPageCount = Math.ceil($scope.participants.length / $scope.numPerPage);
        }
    }

    $scope.$watch('pagination.participantsCurrentPage', () => {
        updateParticipantsData();
        $rootScope.$broadcast('participants-page-changed');
    });

    $scope.removeParticipant = (index, title) => {   
        let eventsList = JSON.parse(sessionStorage.getItem('events')).sort(events.getSortByDate), deleteID;
        eventsList.forEach((cur, i) => {
            if(cur.title === title) {
                deleteID = i;
            }
        })
        eventsList[deleteID].count--;              
        $scope.participants.splice(index, 1);
        sessionStorage.setItem('events', JSON.stringify(eventsList));
        sessionStorage.setItem('participants', JSON.stringify($scope.participants));
        updateParticipantsData();
    }
    
});