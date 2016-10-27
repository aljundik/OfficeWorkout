var obj;
var exerciseIndex = 0;
var today_point = 10;
angular.module('SimpleRESTIonic.controllers', [])
  
    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService) {
        var login = this;

        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                    console.log(error)
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            login.email = '';
            login.password = '';            
            $state.go('tab.dashboard');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    login.email = '';
                    login.password = '';
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })

        }

        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
    })

    .controller('DashboardCtrl', function (ItemsModel, $rootScope, $scope, $timeout) {
        var vm = this;
         getAll()
        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                     obj=vm.data;
                    //  console.log(obj);
                   //onsole.log(obj['0'].seconds);
                    $scope.myTimerFixed =obj[exerciseIndex].seconds;
                     $scope.myTimer =  obj[exerciseIndex].seconds;
                     $scope.EXname = obj[exerciseIndex].name;
                     $scope.EXdescription = obj[exerciseIndex].description;
                     
                    });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
            ItemsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }
        
        

        initCreateForm();
        getAll();
        //  $scope.myTimerFixed =5;
        //  $scope.myTimer =  5;
         
    
    
    // var svg = document.getElementByClassName('round-progress')[0];
     
    // // svg.onload = function(){
    // //   $scope.radius = svg.getBoundingClientRect().width/2;
    // // };
    var myTimerVariable;
    
     $scope.myCustomTimer= function (){
       $scope.myTimer--;  
       
       if($scope.myTimer < 0){
           if (exerciseIndex < 7){ // 7 = num of exercises
            $scope.myTimerFixed =obj[exerciseIndex].seconds;
            $scope.myTimer =  obj[exerciseIndex].seconds;
            $scope.EXname = obj[exerciseIndex].name;
            $scope.EXdescription = obj[exerciseIndex].description;
            console.log(today_point);
           }else{
               exerciseIndex=0;
               $scope.EXname = "Well done!";
                $scope.EXdescription = "";
              console.log(today_point);
               
           }

         $timeout.cancel(myTimerVariable); 
         complete(false);
         return false;
         
       }
      
      myTimerVariable = $timeout($scope.myCustomTimer,1000);
    }
    $scope.start = function(){
      myTimerVariable = $timeout($scope.myCustomTimer,1000);
               exerciseIndex++;

    }
    $scope.stop = function(){
       
       $timeout.cancel(myTimerVariable);
       complete(true);
    };
    
    var complete = function(foreFulAbort){
      
      if(foreFulAbort) {
        
        alert('Keep working');
      }else {
       
        alert('you completed the exercise');
         today_point=today_point+10;
      }
      
    };
    
    $scope.getStyle = function(){
      
      var transform = 'translateY(-50%) translateX(-50%)';
      
      return {
        
        'top' : '50%',
        'bottom' : 'auto',
        'left' : '50%',
        'transform' : transform,
        
        '-moz-transform' : transform,
        '-webkit-transform' : transform,
        'font-size' : $scope.radius/3.5+ 'px'
        
        
        
      };
      
      
      
    };
        

    });

