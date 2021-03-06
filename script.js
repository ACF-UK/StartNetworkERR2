var dataTable = dc.dataTable("#dc-data-table")

d3.tsv("data.tsv", function(data) {
 // drawMarkerSelect(data);
  drawMarkerArea(data);
});


function drawMarkerArea(data) {

  var xf = crossfilter(data);

  var groupname = "marker-select";

  var all = xf.groupAll();

  dc.dataCount("#dc-data-count", groupname)
        .dimension(xf)
        .group(all);

  var o = d3.scale.ordinal()
        .domain("ActionAid", "CRS", "DRC", "IMC", "Internews", "NRC", "Oxfam", "Samaritan's Purse", "Translators Without Borders")
        // .range(colorbrewer.RdBu[9]);

  var byAgency = xf.dimension(function(d) { return d.Agency; });
  var byAgencyGroup = byAgency.group().reduceCount();

  var bySector = xf.dimension(function(d) { return d.Sector; });
  var bySectorGroup = bySector.group().reduceCount();

  var byCountry = xf.dimension(function(d) { return d.Country; });
  var byCountryGroup = byCountry.group().reduceCount();

  var byProvince = xf.dimension(function(d) { return d.Province; });
  var byProvinceGroup = byProvince.group().reduceCount();

  var activities = xf.dimension(function(d) { return d.geo; });
  var activitiesGroup = activities.group().reduceCount();


  var tableData = crossfilter(data);
  var all = tableData.groupAll();
  var dimension = tableData.dimension(function (d) {
    return d.Agency;
  });


  dc.leafletMarkerChart("#map .map", groupname)
      .dimension(activities)
      .group(activitiesGroup)
      .width(400)
      .height(390)
      .center([39,27])
      .zoom(5)
      .cluster(true)
      // .marker(function (d, map){return d.Agency})
      .filterByArea(true)
      .renderPopup(false)
      // .bindPopup('sup')
      .popup(function (d, marker) {
        return d.Agency;
      })
      .brushOn(true);
      // .featureKeyAccessor(function(feature){
      //           return feature.properties[config.joinAttribute];
      //       });


//Agency (Who)
var agencyChart = dc.rowChart("#Agency .Agency", groupname)

agencyChart.margins({top: 5, left: 10, right: 10, bottom: 50})
      .width(200)
      .height(400)
      .dimension(byAgency)
      .colors(["cadetblue"])
      .group(byAgencyGroup)
      .title(function (d){
            return d.value;
            })
      .ordering(function(d) { return -d.value; })
      .elasticX(true)
      .xAxis().ticks(2);

//Sector(What)
var sectorChart = dc.rowChart("#Sector .Sector", groupname)

      sectorChart.margins({top: 5, left: 10, right: 10, bottom: 50})
      .width(200)
      .height(400)
      .dimension(bySector)
      .group(bySectorGroup)
      .colors([ "#9467bd", "#ff7f0e", "#2ca02c", "#d62728","#7f7f7f","#8c564b", "#bcbd22", "#e377c2", "#1f77b4"])
      .title(function(d){return d.value;})
      // .ordering(function(d) { return -d.value; })
      // .ordering([ "Protection", "Other", "", "Comms","FSL","Shelter", "Social Mobalisation",  "WASH", "Camp Management", "Nutrition"])
      .elasticX(true)
      .xAxis().ticks(2);

//Region (Where)
var provinceChart = dc.rowChart("#Province .Province", groupname)

      provinceChart.margins({top: 5, left: 10, right: 10, bottom: 50})
      .width(200)
      .height(400)
      .dimension(byProvince)
      .group(byProvinceGroup)
      .colors(["gray"])
      .title(function (d){return d.value;})
      .ordering(function(d) { return -d.value; })
      .elasticX(true)
      .xAxis().ticks(2);



var dataTable = dc.dataTable("#dc-data-table", groupname)

    dataTable.dimension(activities)
    .group(function(d){return d.Sector;})
    .size(75)
    .columns([
      function(d) {return d.blank;},
      function(d) {return d.Agency;},
      function(d) {return d.Country;},
      function(d) {return d.Province1;},
      function(d) {return d.Indicator;},
      function(d) {return d.Target;},
      function(d) {return d.Interim;}
    ])
    .sortBy(function (d) {
      return d.Sector;
    })
    .order(d3.ascending);


$('#reset').on('click', function (){
  dc.filterAll(groupname);
  dc.redrawAll(groupname);
  return false;
})

dc.renderAll(groupname);


function AddXAxis(chartToUpdate, displayText)
{
    sectorChart.svg()
                .append("text")
                .attr("class", "x-axis-label")
                .attr("text-anchor", "middle")
                .attr("x", chartToUpdate.width()/2)
                .attr("y", chartToUpdate.height()-3.5)
                .text(displayText);
}
AddXAxis(sectorChart, "Number of output indicators");
}
