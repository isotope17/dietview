angular
    .module('altairApp', [ angularDragula(angular) ] )
    .controller('scrum_boardCtrl', [
        '$rootScope',
        '$scope',
        'tasks_list',
        'dragulaService',
        'modals',
        function ($rootScope,$scope,tasks_list,dragulaService,modals) {

            $rootScope.page_full_height = true;

            $scope.$on('$destroy', function() {
                $rootScope.page_full_height = false;
            });

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                // set width for scrum board container
                var $scrumBoard = $('#scrum_board'),
                    childWidth = $scrumBoard.children('div').width(),
                    childsCount = $scrumBoard.children('div').length;

                $scrumBoard.width(childWidth * childsCount);
            });

            $scope.task_groups = [
                {
                    id: 'todo',
                    name: 'To Do'
                },
                {
                    id: 'inProgress',
                    name: 'In progress'
                },
                {
                    id: 'done',
                    name: 'Done'
                }
            ];

            $scope.tasks_list = tasks_list;

            // task info
            $scope.taskInfo = function(task) {
                $scope.info = {
                    name: task.name,
                    title: task.title,
                    status: task.status,
                    description: task.description,
                    assignee: task.assignee
                }
            };

            var clear_form = function () {
                $scope.newTask = {
                    name: '',
                    assignee: '',
                    group: ''
                };
            };

            var addTask = function () {
                $scope.tasks_list.push($scope.newTask);
            };

            $scope.addTask = function ($event) {
                addTask();
                modals.alert('New task has been added');
                clear_form();
            };

            var deleteTask = function () {
                for (var i = 0; i < $scope.tasks_list.length; i++) {
                    if ($scope.info.name === $scope.tasks_list[i].name) {
                        $scope.tasks_list.splice(i, 1);
                        UIkit.modal('#task_info').hide();
                        break;
                    }
                }
            };

            $scope.deleteTask = function ($event) {
                modals.confirm('Are you sure you want to delete the task?', function () {
                    deleteTask();
                    modals.alert('The task has been deleted');
                });
            };

            // new task
            $scope.newTask = {
                name: '',
                assignee: '',
                group: ''
            };

            $scope.newTask_assignee =  [
                'Chef',
                'Delivery',
                'Nutritionist',
                'Secretary'
            ];
            $scope.newTask_assignee_config = {
                create:false,
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                placeholder: 'Select Assignee...'
            };
            $scope.newTask_group =  [
                { name: 'todo', title: 'To Do' },
                { name: 'inProgress', title: 'In Progress' },
                { name: 'done', title: 'Done' }
            ];
            $scope.newTask_group_config =  {
                create:false,
                maxItems: 1,
                valueField: 'name',
                labelField: 'title',
                placeholder: 'Select Group...'
            };

            $scope.$on('tasks.drop', function (e, el, target, source) {
                console.log(target[0].id);
            });

        }
    ]);
