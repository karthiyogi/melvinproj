var express = require('express');  
var tabletojson = require('tabletojson');
var Promise = require('promise');
var moment = require('moment');
var _ = require('lodash');

var app = express();  
app.get('/:commodity/:state/:district/:market/:from/:to', function (req, res) {  
console.log(req.params.commodity)
console.log(req.params.state)
console.log(req.params.district)
console.log(req.params.market)
console.log(req.params.from)
console.log(req.params.to)

//     var url = 'http://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=23&Tx_State=MH&Tx_District=1&Tx_Market=153&DateFrom=01-Mar-2018&DateTo=17-Apr-2018&Fr_Date=01-Mar-2018&To_Date=17-Apr-2018&Tx_Trend=0&Tx_CommodityHead=Onion&Tx_StateHead=Maharashtra&Tx_DistrictHead=Ahmednagar&Tx_MarketHead=Ahmednagar';
// tabletojson.convertUrl(url, function(tablesAsJson) {
// //   var listofSovereignStates = tablesAsJson[0];
//   console.log(tablesAsJson);
//   res.send(tablesAsJson);  
// });

// const asyncMiddleware = async (req,res,next) => {
//   const data = await getjsondate();
// //   req.data = data.json()
 
// }
getjsondate(req.params.commodity,req.params.state,req.params.district,req.params.market,req.params.from,req.params.to).then(function(val){
 
  res.send(val)

});
  
// getdetail().then(function(val){
//   res.send(val)
// })
// res.send(getdetail())

})  
var server = app.listen(8000, function () {  
var host = server.address().address  
server.timeout = 240000000;
  var port = server.address().port  
 console.log("Example app listening at http://%s:%s", host, port)  
}) 

function getjsondate(commodity,state,district,market,from,to) {


  var enumerateDaysBetweenDates = function(startDate, endDate) {
    var now = startDate, dates = [];
    
   while (now.isSameOrBefore(endDate)) {
          dates.push(now.format('DD-MMM-YYYY'));
          now.add(1, 'days');
      }
    return dates;
};

var fromDate = moment();
var toDate   = moment().add(6, 'days');
var jsonArray = enumerateDaysBetweenDates(moment(from), moment(to));
// var jsonArray = enumerateDaysBetweenDates(moment("01-Jan-2003"), moment("31-Jan-2003"));
// console.log(jsonArray);

// var array = [ 1, 2, 3, 4 ,5 ];
// console.log(_.first(array, 3))

// jsonArray = result;
  return new Promise(function(resolve,reject) {

    var alltables = []


    var counter = 0;
// jsonArray = [1,2];
for (let index = 0; index < jsonArray.length; index++) {
  console.log("main")
  var url = 'http://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity='+commodity+'&Tx_State='+state+'&Tx_District='+district+'&Tx_Market='+market+'&DateFrom='+jsonArray[index]+'&DateTo='+jsonArray[index]+'&Fr_Date='+jsonArray[index]+'&To_Date='+jsonArray[index]+'&Tx_Trend=1&Tx_CommodityHead=Onion&Tx_StateHead=Maharashtra&Tx_DistrictHead=Ahmednagar&Tx_MarketHead=Ahmednagar';
  
  // var url = 'http://agmarknet.gov.in/SearchCmmMkt.aspx?Tx_Commodity=78&Tx_State=KK&Tx_District=1&Tx_Market=0&DateFrom='+jsonArray[index]+'&DateTo='+jsonArray[index]+'&Fr_Date='+jsonArray[index]+'&To_Date='+jsonArray[index]+'&Tx_Trend=1&Tx_CommodityHead=Onion&Tx_StateHead=Maharashtra&Tx_DistrictHead=Ahmednagar&Tx_MarketHead=Ahmednagar';
   
  // console.log(jsonArray[index]);
  tabletojson.convertUrl(url, function(tablesAsJson) {
    //  console.log("inisde");
      // tablesAsJson[0].add({'date':jsonArray[i]})
      // console.log(tablesAsJson[0][0]);


      if(tablesAsJson[0][0] != undefined){
        // console.log(jsonArray[index]);
        tablesAsJson[0][0].date = jsonArray[index];
        console.log(tablesAsJson[0][0]);
      }

      alltables.push(tablesAsJson[0][0]);

      // console.log(counter+"   "+jsonArray.length);
      if(counter == jsonArray.length - 1) {
        // console.log("Entered")

        var onlyfewtable = _.map(_.filter(alltables, function(value) {
          
          if(value[0]!="No Data Found"){

            // var newValue = {
            //   StateName: value['State Name'],
            //   Arrivals: value['Arrivals (Tonnes)'],
            //   Date: value['date']
            // }
            // console.log("entered")
            // console.log(newValue);
            return value;
          }else{
            console.log("Not entered")
          }
          // return _.omit((value[0]!="No Data Found"), [0]);

        // resolve(_.omit(onlyfewtable, ['0']))
        
        }), function(val){
          var newValue = {
            StateName: val['State Name'],
            Arrivals: val['Arrivals (Tonnes)'],
            Date: val['date']
          }
          return newValue;
        });


        resolve(onlyfewtable)
    }

    counter++;

})


}



  
});

}


