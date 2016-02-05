//

var ribbon = (function () {

  rbFilters = {
    views: getThisFilters('viewsID'),
    sprint: getThisFilters('sprintsID'),
    reqStatus: getThisFilters('reqStatus'),
    otherFilters: {
      departments: getThisFilters('departmentsID'),
      reqType: getThisFilters('reqTypeID'),
      taskType: getThisFilters('taskTypeID'),
      requester: getThisFilters('requesterID'),
      portfolio: getThisFilters('portfolioID'),
      started: getThisFilters('portfolioID'),
      owner: getThisFilters('portfolioID'),
      moreFilters: {},
      getMoreFilters: function () {
      }
    },
    set: function () {
    },
    get: function () {
    }
  };


}());


