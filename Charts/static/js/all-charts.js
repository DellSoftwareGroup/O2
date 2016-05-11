var dataSource = new kendo.data.DataSource({
      transport: {
        read: {
          url: function () {
            return "../../Charts/endpoints/sla-variance-drill-down.json";
          },
          dataType: "json"
        }
      },
      group: {
        field: "type"
      }
    }),
    valueArrayX = new Array(),
    valueArrayY = new Array();
$.ajax({
  url: "../../Charts/endpoints/sla-variance-drill-down.json"
}).done(function (response) {
  var i = 1, j = 1;
  $.each(response, function (key, val) {
    if (!isInArray(val.category, valueArrayX)) {
      valueArrayX[i] = val.category;
      /*console.log(val.category);*/
      i++;
    }

  });

  /*$.each(valueArrayX, function (index, value) {
   console.log(index + ": " + value);
   });*/

  $.each(response, function (key, val) {
    if (!isInArray(val.sla, valueArrayY)) {
      valueArrayY[j] = val.sla;
      j++;
    }
  });

  /*$.each(valueArrayY, function (index, value) {
   console.log(index + ": " + value);
   });*/
});

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

function changeXLabels(value) {
  return valueArrayX[value] == undefined ? "" : valueArrayX[value];
}

function changeYLabels(value) {
  return valueArrayY[value] == undefined ? "" : valueArrayY[value];
}

function createChart() {
  $(".chart-overall-opened-closed").kendoChart({
    title: {
      text: "Number of Requests "
    },
    legend: {
      visible: true,
      position: "bottom"
    },
    seriesDefaults: {
      type: "column",
      labels: {
        visible: true,
        background: "transparent",
        position: "center",
        color: "white"
      }
    },
    series: [{
      overlay: {
        gradient: "none"
      },
      name: "Opened Requests",
      stack: "Open",
      data: [120, 160, 80, 90, 140, 110, 65, 140, 100, 80, 130, 85]
    }, {
      overlay: {
        gradient: "none"
      },
      name: "Closed Requests",
      stack: "Complete",
      data: [100, 140, 80, 90, 120, 100, 60, 140, 100, 60, 110, 85]
    }],
    seriesColors: ["#579AD6", "#78C466"],
    valueAxis: {
      Max: 160,
      majorUnit: 5,
      line: {
        visible: false
      },
      labels: {
        step: 2
      }
    },
    categoryAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      majorGridLines: {
        visible: false
      }
    },
    tooltip: {
      visible: true,
      template: "#= series.name #"
    }
  });

  $("#chart-opened-closed-data-protection").kendoChart({
    title: {
      text: "Number of Requests "
    },
    legend: {
      visible: false
    },
    chartArea: {
      width: 355,
      height: 260
    },
    seriesDefaults: {
      type: "column",
      gap: 1,
      spacing: 1,
      labels: {
        visible: true,
        background: "transparent",
        position: "top",
        padding: {
          top: -20
        }
      }
    },
    series: [{
      overlay: {
        gradient: "none"
      },
      name: "Opened Requests",
      stack: "Open",
      data: [30, 40, 10, 20, 10, 15, 5, 20, 10, 10, 30, 5]
    }, {
      overlay: {
        gradient: "none"
      },
      name: "Closed Requests",
      stack: "Complete",
      data: [30, 30, 10, 20, 10, 15, 5, 20, 10, 10, 30, 5]
    }],
    seriesColors: ["#579AD6", "#78C466"],
    valueAxis: {
      Max: 250,
      majorUnit: 5,
      line: {
        visible: false
      },
      label: {
        margin: -30
      }
    },
    categoryAxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      majorGridLines: {
        visible: false
      }
    },
    tooltip: {
      visible: true,
      template: "#= series.name #"
    }
  });

  $("#sla-variance").kendoChart({
    /*title: {
     position: "top",
     text: "Tasks"
     },*/
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      type: "donut",
      startAngle: 150
    },
    series: [{
      name: "early",
      padding: 20,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "-1",
        value: 200,
        color: "#78C466"
      }, {
        category: "-2 to -3",
        value: 125,
        color: "#5FAA4D"
      }, {
        category: "-4 to -5",
        value: 150,
        color: "#479035"
      }, {
        category: "-6 to -7 to -8",
        value: 120,
        color: "#2E761D"
      }, {
        category: "-8+",
        value: 100,
        color: "#165D05"
      }],
      labels: {
        visible: true,
        font: "14px Arial,Helvetica,sans-serif",
        background: "transparent",
        position: "center",
        template: "#= value #",
        color: "white"
      }
    }, {
      name: "late",
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "+1",
        value: 200,
        color: "#F46868"
      }, {
        category: "+2 to +3",
        value: 175,
        color: "#D94F4F"
      }, {
        category: "+4 to +5",
        value: 50,
        color: "#BF3636"
      }, {
        category: "+6 to +7 to +8",
        value: 140,
        color: "#A41D1D"
      }, {
        category: "8+",
        value: 40,
        color: "#8A0404"
      }],
      labels: {
        visible: true,
        font: "14px Arial,Helvetica,sans-serif",
        background: "transparent",
        position: "center",
        template: "#= value #",
        color: "white"
      }
    }],
    tooltip: {
      visible: true,
      template: "SLA Variance #= category # : #= value # tasks"
    }
  });
  $("#slav-met-missed-sla").kendoChart({
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      labels: {
        visible: true,
        background: "transparent",
        font: "14px Arial,Helvetica,sans-serif",
        position: "center",
        color: "white",
        template: "#= value #%"
      }
    },
    series: [{
      type: "pie",
      padding: 0,
      startAngle: 90,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "Met SLA",
        value: 15,
        tasks: 100,
        color: "#479035"
      }, {
        category: "Missed SLA",
        value: 85,
        tasks: 595,
        color: "#F15858"
      }]
    }],
    tooltip: {
      visible: true,
      template: "#= category# : #= dataItem.tasks# tasks "
    }
  });
  $("#baseline-vs-actual").kendoChart({
    /*title: {
     position: "top",
     text: "Tasks"
     },*/
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      type: "donut",
      startAngle: 150
    },
    series: [{
      name: "Ended late",
      padding: 20,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "-1",
        value: 50,
        color: "#78C466"
      }, {
        category: "-2 to -3",
        value: 25,
        color: "#5FAA4D"
      }, {
        category: "-4 to -5",
        value: 10,
        color: "#479035"
      }, {
        category: "-6 to -7 to -8",
        value: 10,
        color: "#2E761D"
      }, {
        category: "-8+",
        value: 10,
        color: "#165D05"
      }]
      ,
      labels: {
        visible: true,
        font: "14px Arial,Helvetica,sans-serif",
        background: "transparent",
        position: "center",
        template: "#= value #",
        color: "white"
      }
    }, {
      name: "Started late",
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "+1",
        value: 75,
        color: "#F46868"
      }, {
        category: "+2 to +3",
        value: 50,
        color: "#D94F4F"
      }, {
        category: "+4 to +5",
        value: 20,
        color: "#BF3636"
      }, {
        category: "+6 to +7 to +8",
        value: 40,
        color: "#A41D1D"
      }, {
        category: "8+",
        value: 20,
        color: "#8A0404"
      }],
      labels: {
        visible: true,
        font: "14px Arial,Helvetica,sans-serif",
        background: "transparent",
        position: "center",
        template: "#= value #",
        color: "white"
      }
    }],
    tooltip: {
      visible: true,
      template: "#= series.name # #= category # : #= value # tasks"
    }
  });
  $("#started-late-ended-early").kendoChart({
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      labels: {
        visible: true,
        background: "transparent",
        font: "14px Arial,Helvetica,sans-serif",
        position: "center",
        color: "white",
        template: "#= value #%"
      }
    },
    series: [{
      type: "pie",
      padding: 0,
      startAngle: 90,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "Started late",
        value: 76,
        tasks: 205,
        color: "#479035"
      }, {
        category: "Ended early",
        value: 24,
        tasks: 65,
        color: "#F15858"
      }]
    }],
    tooltip: {
      visible: true,
      template: "#= category# : #= dataItem.tasks# tasks"
    }
  });
  $("#started-early-ended-late-1").kendoChart({
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      labels: {
        visible: true,
        background: "transparent",
        font: "14px Arial,Helvetica,sans-serif",
        position: "center",
        color: "white",
        template: "#= value#%"
      }
    },
    series: [{
      type: "pie",
      padding: 0,
      startAngle: 90,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "Started early",
        value: 58,
        tasks:145,
        color: "#479035"
      }, {
        category: "Ended late",
        value: 42,
        tasks:105,
        color: "#F15858"
      }]
    }],
    tooltip: {
      visible: true,
      template: "#= category# : #= dataItem.tasks# tasks"
    }
  });
  $("#planned-vs-actual").kendoChart({
    /*title: {
     position: "top",
     text: "Tasks"
     },*/
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      type: "donut",
      startAngle: 150
    },
    series: [{
      name: "Ended late",
      padding: 20,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "-1",
        value: 50,
        color: "#78C466"
      }, {
        category: "-2 to -3",
        value: 25,
        color: "#5FAA4D"
      }, {
        category: "-4 to -5",
        value: 10,
        color: "#479035"
      }, {
        category: "-6 to -7 to -8",
        value: 10,
        color: "#2E761D"
      }, {
        category: "-8+",
        value: 10,
        color: "#165D05"
      }]
      ,
      labels: {
        visible: true,
        font: "14px Arial,Helvetica,sans-serif",
        background: "transparent",
        position: "center",
        template: "#= value #",
        color: "white"
      }
    }, {
      name: "Started late",
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "+1",
        value: 65,
        color: "#F46868"
      }, {
        category: "+2 to +3",
        value: 70,
        color: "#D94F4F"
      }, {
        category: "+4 to +5",
        value: 30,
        color: "#BF3636"
      }, {
        category: "+6 to +7 to +8",
        value: 20,
        color: "#A41D1D"
      }, {
        category: "8+",
        value: 30,
        color: "#8A0404"
      }],
      labels: {
        visible: true,
        font: "14px Arial,Helvetica,sans-serif",
        background: "transparent",
        position: "center",
        template: "#= value #",
        color: "white"
      }
    }],
    tooltip: {
      visible: true,
      template: "#= series.name # #= category # : #= value # tasks"
    }
  });
  $("#started-late-ended-late").kendoChart({
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      labels: {
        visible: true,
        background: "transparent",
        font: "14px Arial,Helvetica,sans-serif",
        position: "center",
        color: "white",
        template: "#= value#%"
      }
    },
    series: [{
      type: "pie",
      padding: 0,
      startAngle: 90,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "Started late",
        value: 59,
        tasks:215,
        color: "#479035"
      }, {
        category: "Ended late",
        value: 41,
        tasks:150,
        color: "#F15858"
      }]
    }],
    tooltip: {
      visible: true,
      template: "#= category#: #= dataItem.tasks# tasks "
    }
  });
  $("#started-early-ended-late-2").kendoChart({
    legend: {
      visible: false
    },
    chartArea: {
      background: ""
    },
    seriesDefaults: {
      labels: {
        visible: true,
        background: "transparent",
        font: "14px Arial,Helvetica,sans-serif",
        position: "center",
        color: "white",
        template: "#= value#%"
      }
    },
    series: [{
      type: "pie",
      padding: 0,
      startAngle: 90,
      overlay: {
        gradient: "none"
      },
      data: [{
        category: "Started early",
        value: 70,
        tasks:250,
        color: "#479035"
      }, {
        category: "Ended late",
        value: 30,
        tasks:105,
        color: "#F15858"
      }]
    }],
    tooltip: {
      visible: true,
      template: "#= category#: #= dataItem.tasks# tasks "
    }
  });

  $("#sla-variance-dd").kendoChart({
    dataSource: dataSource,
    /*title: {
     text: "SLA per Task Type"
     },*/
    legend: {
      visible: false
    },
    seriesDefaults: {
      type: "bubble",
      labels: {
        visible: true,
        background: "transparent",
        position: "center",
        format: "{2:N0}",
        color:"white"
      }
    },
    chartArea: {
      background: ""
    },
    series: [{
      type: "bubble",
      minSize: 10,
      maxSize: 40,
      xField: "standing",
      yField: "range",
      sizeField: "number",
      colorField: "color",
      opacity: 0.9
    }]
    ,
    xAxis: {
      labels: {
        template: "#= changeXLabels(value) #"
      },
      majorUnit: 1,
      appearance: {
        LabelAppearance: {
          Position: {
            AlignedPosition: "center"
          }
        }
      }
    },
    yAxis: {
      labels: {
        margin: {top: 0},
        template: "#= changeYLabels(value) #"
      },
      axisCrossingValues: 6,
      majorUnit: 1,
      max: 12
    },
    tooltip: {
      visible: true,
      template:"SLA #=dataItem.sla # : #=dataItem.number # Requests"
    }
  });

  $("#planned-closed-data-protection").kendoChart({
    dataSource: {
      transport: {
        read: {
          url: "../../Charts/endpoints/data-protection.json",
          dataType: "json"
        }
      }/*,
       sort: {
       field: "year",
       dir: "asc"
       }*/
    },
    title: {
      text: "Planned/Closed requests by Data Protection"
    },
    legend: {
      position: "bottom"
    },
    seriesDefaults: {
      type: "line"
    },
    series: [{
      field: "planned",
      name:"Planned",
      color:"#579AD6"
    }, {
      field: "closed",
      name: "Closed",
      color:"#78C466"
    }],
    categoryAxis: {
      categories:["Week1","Week2","Week3","Week4","Week1","Week2","Week3","Week4"],
      crosshair: {
        visible: true
      }
    },
    valueAxis: {
      Max: 50,
      majorUnit: 5
    },
    tooltip: {
      visible: true,
      /*shared: true*/
      template: "<strong>Sprint #= dataItem.sprint#</strong> <br> #= series.name #: #= value #"
      /*sharedTemplate:kendo.template($("#template").html())*/
      /*template:"<strong>Sprint #= dataItem.sprint#</strong> <br> Planned: #=dataItem.planned # <br> Closed: #=dataItem.closed #"*/
    }
  });
  $("#planned-closed-security").kendoChart({
    dataSource: {
      transport: {
        read: {
          url: "../../Charts/endpoints/data-protection.json",
          dataType: "json"
        }
      }/*,
       sort: {
       field: "year",
       dir: "asc"
       }*/
    },
    title: {
      text: "Planned/Closed requests by Security"
    },
    legend: {
      position: "bottom"
    },
    seriesDefaults: {
      type: "line"
    },
    series: [{
      field: "planned",
      name:"Planned",
      color:"#579AD6"
    }, {
      field: "closed",
      name: "Closed",
      color:"#78C466"
    },{
      xField:"week"
    }
    ],
    categoryAxis: {
      categories:["Week1","Week2","Week3","Week4","Week1","Week2","Week3","Week4"],
      crosshair: {
        visible: true
      }
    },
    valueAxis: {
      Max: 50,
      majorUnit: 5
    },
    tooltip: {
      visible: true,
      /*shared: true*/
      template: "<strong>Sprint #= dataItem.sprint#</strong> <br> #= series.name #: #= value #"
      /*template:"<strong>Sprint #= dataItem.sprint#</strong> <br> Planned: #=dataItem.planned # <br> Closed: #=dataItem.closed #"*/
    }
  });
}
function createSparklines() {
  // binding to array
  $("#data-protection-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      30, 40, 10, 20, 10, 15, 5, 20, 10, 10, 30, 5
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });

  $("#data-protection-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      30, 30, 10, 20, 10, 15, 5, 20, 10, 10, 30, 5
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });

  $("#endpoints-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      10, 30, 20, 10, 15, 10, 10, 10, 10, 10, 10, 20
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#endpoints-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      10, 30, 15, 10, 15, 10, 10, 10, 10, 10, 10, 20
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "closed : {0}"
    }
  });
  $("#databases-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      20, 20, 5, 10, 5, 20, 0, 20, 10, 5, 10, 10
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#databases-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      20, 20, 5, 10, 5, 20, 0, 15, 10, 5, 10, 10
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });

  $("#security-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      10, 10, 5, 20, 30, 20, 10, 20, 5, 5, 10, 15
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#security-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      10, 10, 5, 20, 30, 20, 10, 20, 5, 5, 10, 15
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });

  $("#platforms-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      10, 5, 10, 10, 30, 10, 5, 20, 5, 5, 10, 5
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#platforms-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      10, 5, 10, 10, 30, 10, 5, 20, 5, 5, 10, 5
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });

  $("#windows-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      10, 20, 10, 5, 10, 5, 5, 10, 10, 5, 20, 10
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#windows-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      10, 20, 10, 5, 10, 5, 5, 10, 10, 5, 20, 10
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });

  $("#none-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      10, 10, 10, 5, 10, 10, 5, 20, 20, 20, 5, 5
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#none-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      10, 10, 10, 5, 10, 10, 5, 20, 20, 20, 5, 5
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });

  $("#sim-opened").kendoSparkline({
    seriesColors: ["#579AD6"],
    data: [
      0, 5, 10, 10, 10, 10, 20, 20, 30, 0, 15, 15
    ],
    color: "#579AD6",
    tooltip: {
      visible: true,
      format: "Opened : {0}"
    }
  });


  $("#sim-closed").kendoSparkline({
    type: "column",
    seriesColors: ["#78C466"],
    data: [
      0, 5, 10, 10, 10, 10, 20, 20, 30, 0, 15, 15
    ],
    color: "#78C466",
    tooltip: {
      visible: true,
      format: "Closed : {0}"
    }
  });


}

$(function () {
  createChart();
  createSparklines();
});
$(document).bind("kendo:skinChange", createChart);
$(document).bind("kendo:skinChange", createSparklines);