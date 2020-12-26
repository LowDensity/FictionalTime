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
        var unitDef = calendar[unitName];
        var amVal = unitDef.volume;
        var baseUnit = calendar[unitDef.unit_type];
        while(typeof(baseUnit)!="undefined"){
            amVal = amVal*baseUnit.volume;
            baseUnit = calendar[baseUnit.unit_type]; 
        }
        return amVal;
        
    }

    FictionalTime.Calendars =new Array();//已知的所有曆法，不確定會不會用到
    FictionalTime.addCalendarFromBody=function(){
        //從script標籤的tag中取得曆法定義，主要用在啟動即載入的狀況
    }



    //關於Calendar class的定義
    FictionalTime.Calendar=function(){
     function calendar(){};
     //定義區塊，以下區塊定義這個物件的結構。
     var unit_list = new Object();
     var name = "Default Calendar" ; //這個曆法的名字，應該要從建構函式中接收
     var fns={
         "name" :   name
         ,"add"  :   add
         ,"getUnit"  :   getUnit
         ,"unit_list"    :   unit_list 
        }
        
    for(let fn in fns){
          if(!fns.hasOwnProperty(fn)){
              calendar.prototype[fn]=fns[fn];
        }
    }
    //定義區塊結束，以下開始實作區塊

     // 單位名稱, 組成, 類型(stack,periodical),計算機(未使用，主要用在periodical)
     function add(unit_name,consist_of,type,calculator){
         //add a unit def to this 
        unit_list.push({
            "unit_name" : unit_name
            ,"consist_of" : consist_of
            ,"type" : type
            ,"calculator"   :   calculator
        });
     }

     function getUnit(unit_name){
         for(var unitNo=0;unit_list[unitNo].unit_name!==unit_name.trim();unitNo++);
         return unit_list[unitNo];
     }
     
     return calendar;      
    }();

    /**載入後立即執行 */
    FictionalTime.addCalendarFromBody();
}());


