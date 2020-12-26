//設計中的Fictional Time

//prototype for calendar class
// var time_unit={

//     "second":{
//         "volume" : 1000,
//         "volume_type" : "accumulate",
//         "unit_type": "AM" // AM = Absolute Minimum   
//     },
//     "minute":{
//         "volume" : 60,
//         "volume_type" : "accumulate",
//         "unit_type":"second"
//     },
//     "hour":{
//         "volume" :  60 ,
//         "volume_type" : "accumulate",
//         "unit_type":"minute",
//     },
//     "day":{
//         "volume" :17,
//         "volume_type" : "accumulate",
//         "unit_type" :"hour"
//     },
//     "year":{
//         "volume" :553,
//         "volume_type" : "periodically",
//         "unit_type" :"day"
//     }
// }
(function(){
    window.FictionalTime=new Object();
    FictionalTime.getUnitVal=(
        AM_TimeStamp    //Time Stamp Value in AM unit
        ,calendar   // Fictional Time.Calendar 物件
        ,unitName   // 單位名稱
        ) => {
         //將 TimeStamp轉為各種時間單位，ex: 月、年、小時

         var curStamp=AM_TimeStamp;
         var unitDefinition=calendar[unitName];
         for(
             var unitVal=0;
             curStamp > unitDefinition.volume ;
             ((curStamp-=unitDefinition.volume) & unitVal++) 
         );

         return {
             "unit_name":unitName,
             "unit_value" : unitVal
         }
    }
    FictionalTime.getUnitAmVal=(unitName,calendar)=>{
        //取得各單位的AM值用來做計算
        var unitDef = calendar[unit_name];
        var amVal = unitDef.volume;
        var baseUnit = calendar[unitDef.unit_type];
        while(typeof(baseUnit)!="undefined"){
            amVal = amVal*baseUnit.volume;
            baseUnit = calendar[baseUnit.unit_type]; 
        }
        return amVal;
        
    }


    //關於Calendar class的定義
    FictionalTime.Calendar=function(){
     function calendar(){};
     
     return calendar;      
    
    
    }();



}());


