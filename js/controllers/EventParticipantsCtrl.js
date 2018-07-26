angular.module('myApp').controller('EventParticipantsCtrl', function($scope, $rootScope){ 

    $scope.pagination = {};
    $scope.pagination.participantsCurrentPage = 1;
    $scope.numPerPage = 10;

    function updateEventParticipantsData() {
        const begin = (($scope.pagination.participantsCurrentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.participants = JSON.parse(sessionStorage.getItem('participants'));
        $scope.eventParticipants = [];
        $scope.participants.forEach((cur) => {
            if(cur.event_id === $scope.$parent.eventTitle) {
                $scope.eventParticipants.push(cur);
            }
        });
        $scope.filteredEventParticipants = $scope.eventParticipants.slice(begin, end);
        $scope.pagination.participantsPageCount = Math.ceil($scope.eventParticipants.length / $scope.numPerPage);
    }  

    $scope.$watch('pagination.participantsCurrentPage', () => {
        updateEventParticipantsData();
        $rootScope.$broadcast('participants-page-changed');
    });

});