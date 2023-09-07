$scope.openSectionList = function (chapterName) {
    if(!$scope.importFromBookMode){
        //console.log(chapterName)
        // console.log('open section', sectionId );
        // console.log('open chapter', chapterName );
        // $scope.ListStory()
        if($scope.MyTraning && $scope.StoryListFetched){
            const matchingObject = $scope.dataList.find((obj) => obj.chapter_name === chapterName);

            if(matchingObject){
                $scope.matchingObjectId = matchingObject.id
            }
            $scope.NewTasksAdded = JSON.parse(sessionStorage.getItem("subTasks"));
            fetch(`https://devcb.piruby.com/TasksList?Id=${$scope.matchingObjectId}`)
              .then((res) => res.json())
              .then((data) => {
                $scope.data = data;
                $scope.StorySummary = $scope.data.jiraResponse.summary;
                $scope.tasks = $scope.data.jiraResponse.subtasks;
                sessionStorage.setItem("subTasks", JSON.stringify($scope.tasks));
            
                // Find newly added tasks
                const newTasks = $scope.tasks.filter((task) => {
                  return !$scope.NewTasksAdded.some((newTask) => newTask.summary === task.summary);
                });
            
              if(newTasks.length !== 0){
                $scope.extendedSectionList[$scope.StorySummary] = []
                // Process the newly added tasks
                newTasks.forEach((task) => {
                  const taskSummary = task.summary;
            
                  var params = {
                    course_content_id: courseContentId,
                    chapter_name: $scope.StorySummary,
                    previous_section_name: "",
                    updated_section_name: taskSummary,
                    course_section_id: "",
                  };
            
                  // Call the API for each newly added task
                  userDataService.saveCourseSection(userLogged, params)
                    .then(function (value) {
                      console.log("ex", $scope.extendedSectionList[$scope.StorySummary]);
                      $scope.chapterDict[$scope.StorySummary].push(taskSummary);
                      $scope.extendedSectionList[$scope.StorySummary].push({
                        coursesection_id: value.data,
                        section_name: taskSummary,
                        type: "",
                        content_id: "",
                        subname: "",
                      });
                        
                      $scope.$apply();
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                });
              }
            // Create a set to keep track of processed section_names
const processedSectionNames = new Set();

// Iterate through the objects in $scope.extendedSectionList[chapterName]
$scope.extendedSectionList[chapterName].forEach((obj) => {
// Check if the 'link' property is empty and the section_name has not been processed
if (!obj.link && !processedSectionNames.has(obj.section_name)) {
// Find a matching task in $scope.tasks based on 'section_name'
const matchingTask = $scope.tasks.find((task) => task.summary === obj.section_name);

// If a matching task is found, call recommendVideo with task.id and task.summary
if (matchingTask) {
$scope.recommendVideo(matchingTask.id, matchingTask.summary,chapterName);
}

// Mark the section_name as processed
processedSectionNames.add(obj.section_name);
}
});



              });
            
            
        }
        var params = {
            "chapter_name": chapterName,
            "course_content_id": courseContentId,
            "course_id":$scope.course_id,
        }
        sessionStorage.setItem('chapterName',chapterName);
        if (userLogged != null ) {
            // if(!($scope.extendedSectionList[chapterName].length == 1 &&
            //     $scope.extendedSectionList[chapterName][0].section_name == 'New Sub Topic')) 
            //     {
            userDataService.viewCourseSections(userLogged, params)
                .then(function (value) {
                    sessionStorage.setItem('corporate',$scope.selfLearningMode.corporate)
                    //console.log('values', value);
                    value.data.sort((a,b) => {
                        if(a.section_name == b.section_name){
                            if(a.type == b.type)
                            return (a.coursesection_id - b.coursesection_id);
                            else
                                return a.type - b.type;
                        }
                        else{
                            return sortValue*1;
                        }
                    });
                    $scope.isSectionHighlighted = false;
                    $scope.extendedSectionList[chapterName] = value.data;
                    console.log(value.data)
                    $scope.sectionScrollTo = parseInt(sessionStorage.getItem('courseSectionIdChat'));
                    value.data.forEach((e) => {
                        if(e.subname === 'Lecture Notes'){
                        e.subname = 'Session Notes'
                        }
                        if(e.is_assignment){
                            $scope.assesmentMode[chapterName] = true;
                            console.log($scope.assesmentMode)

                        }
                        if(e.coursesection_id === $scope.sectionScrollTo){
                            var sectionElement = document.getElementById("sectionNameScroll");
                           if (sectionElement) {
                            $scope.isSectionHighlighted = true;
                            //  sectionElement.style.backgroundColor = "yellow !important";
                            sectionElement.classList.add("highlightSection");
                            }
                        }
                    })

                    //console.log('extended list', $scope.extendedSectionList);
                    var uniqueSection = [... new Set(value.data.map(x => x.section_name))];
                    uniqueSection = uniqueSection.filter(function(item){
                        return (item != "" && item != null);
                    });
                    
                    //console.log('unique', uniqueSection);
                    $scope.chapterDict[chapterName] = uniqueSection;
                    $scope.$apply();
                    //console.log('chapter array', $scope.chapterDict);
                    //$scope.sectionList = value.data;
                    // console.log('section List', $scope.sectionList);
                    // console.log('eachSection Array on Open', $scope.eachSection);
                    //$scope.courseData();
                    // console.log('eachSection add to global', $scope.globalSection);
                }).catch(function (err, status) {
                    console.log('logged in from another session')
                    console.log(status);
                });
            // }
        } else {
            userDataService.courseSectionBefore(params)
                .then(function (value) {
                   $scope.extendedSectionList[chapterName] = data;
                   const uniqueSection = [... new Set(data.map(x => x.section_name))];
                   // console.log('unique', uniqueSection);
                   $scope.chapterDict[chapterName] = uniqueSection;
                   // console.log('chapter array', $scope.chapterDict);
                    //$scope.sectionList = data;
                    // console.log('sec', $scope.sectionList);
                    // console.log('eachSection', $scope.eachSection);
                    $scope.$apply();
                }).catch(function (err, status) {
                    console.log(status);
                });
        }
    }
    else
    {   var data = $scope.extendedSectionList[chapterName]
        var uniqueSection = [... new Set(data.map(x => x.section_name))];
        uniqueSection = uniqueSection.filter(function(item){
            return (item != "" && item != null);
        });
        
        console.log('unique', uniqueSection);
        $scope.chapterDict[chapterName] = uniqueSection;
    }
}

$scope.openSectionList()

$scope.startQuiz = function(section){
    var courseQuizParams={
        'content_id': section.content_id,
        "que_details": "yes",
    }
    userDataService.getCourseQuiz(userLogged,courseQuizParams)
    .then(data =>{
        var param={
            "content_id" : section.content_id,  
            "course_id" : $scope.course_id,
            "quiztime" :  (data.data[0].quiztime),
            'state':1         
        };
        userDataService.liveCourseQuiz(userLogged,param)
        .then(function(data) {           
            console.log(data)
        })
        .catch(function (err) {
            console.log(err);
        });
    })
    .catch(er => console.log(er))

}  

$scope.startQuiz()