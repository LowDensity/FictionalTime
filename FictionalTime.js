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
    if(typeof(window.FictionalTime)!=="undefined"){return console.log("duplicate initialization");} 
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
    FictionalTime.getUnitAmVal=(unitName,unit_list)=>{
        //取得各單位的AM值用來做計算
        var unitDef = unit_list[unitName];
        var amVal = unitDef.volume;
        var baseUnit = unit_list[unitDef.unit_type];
        var amBaseResolved=false;
        console.log("aa");
        while(typeof(baseUnit)!="undefined"){
            if(amBaseResolved){ console.log("not am");throw new Error("AM is not the only minimum unit of this Calendar.")}
            amVal = amVal*baseUnit.volume;
            amBaseResolved = baseUnit.unit_type==="AM";
            baseUnit = unit_list[baseUnit.unit_type]; 
        }
        console.log("bb");
        if(!amBaseResolved){throw new Error("Unable to resolve unit : " + unitName +" to AM(Absolute Minimum)");}
        return amVal;
        
    }

    FictionalTime.Calendars =new Object();//已知的所有曆法，不確定會不會用到
    FictionalTime.addCalendarFromBody=function(tag){
        //從script標籤的tag中取得曆法定義，主要用在啟動即載入的狀況
        calendar_source=JSON.parse(tag.innerText);
        if(typeof(calendar_source.calendar_name)=="undefined"
         || calendar_source.calendar_name.trim()===""
        ){throw new Error("A valid calendar Name is Required.");}

        if(typeof(FictionalTime.Calendars.source[calendar_source.calendar_name])!="undefined")
        {
            console.warn("Duplicate Calendar Name for "+calendar_source.calendar_name);
            return;
        }

        //keep source for later restoration and checking
        FictionalTime.Calendars.source[calendar_source.calendar_name]=calendar_source;
        var new_calendar= JSON.parse(tag.innerText);
        //generating calendar unit_amval 
        var errorUnits=new Array();

        for(var i = 0 ; i< new_calendar.unit_list.length;i++){
            try{
                new_calendar.unit_list[i]["unit_amval"]=FictionalTime.getUnitAmVal(new_calendar.unit_list[i].unit_name,new_calendar.unit_list);
            }catch(ex){
                console.log(ex);
                errorUnits.push(" unit_name = "+new_calendar.unit_list[i].unit_name);
            }
        }
        console.log("eu.lngth "+errorUnits.length);
        console.error( "Invalid calendar definition on unit : "+errorUnits.join(","));
        if(errorUnits.length!=0){throw new Error( "Invalid calendar definition on unit : "+errorUnits.join(","));}
        FictionalTime.Calendars.actual[new_calendar.calendar_name]=new_calendar;
    }
    FictionalTime.Calendars={
        "source" : new Object()
        ,"actual" : new Object()
    }
    //scan the entire document for calendar definitions(script tag with class calendar_definition)
    FictionalTime.showAlert=false;// if show alert for any initialization problem
    FictionalTime.scanForCalendar=function(){
        console.log("Scanning for calendar");
        var errs = new Array();
        var definitions=document.querySelectorAll("script.calendar_definition");
        for(let i=0;i < definitions.length;i++){
            let definition=definitions[i];
            try{
                FictionalTime.addCalendarFromBody(definition);
            }catch(ex){
                console.log(ex);
            }
        }
        if(errs.length!=0){
            if(FictionalTime.showAlert){
                alert("Some Calendar Definition are invalid , see console for full information");
            }
            console.warn("Some Calendar Definition are invalid , see console for full information");
        }
        console.log("Calendar scan completed. Calendars Registered : ");
        console.log(FictionalTime.Calendars);
    }
    



    //關於Calendar class的定義
    FictionalTime.Calendar=function(){
     function calendar(){}
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
    // setup document initialization event.
    window.addEventListener("load",function(ev){
        FictionalTime.scanForCalendar(ev.document)});

}());

