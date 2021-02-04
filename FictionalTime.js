
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
    FictionalTime.getUnitAmVal=(unitName,unitMap)=>{
        //取得各單位的AM值用來做計算
        if(unitMap[unitName].consist_of==="AM"){return unitMap[unitName].unit_volume;}
        var unitDef = unitMap[unitName];
        var volume = unitDef.unit_volume;
        var baseUnit = unitMap[unitDef.consist_of];
        var amBaseResolved=false;
        while(typeof(baseUnit)!="undefined"){
            if(amBaseResolved){ throw new Error("AM is not the only minimum unit of this Calendar.")}
            volume = volume * baseUnit.unit_volume;
            amBaseResolved = baseUnit.consist_of==="AM";
            baseUnit = unitMap[baseUnit.consist_of]; 
        }
        if(!amBaseResolved){throw new Error("Unable to resolve unit : " + unitName +" to AM(Absolute Minimum)");}
        return volume;       
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
            console.warn("Duplicate Calendar Name for "+calendar_source.calendar_name+".\n Definition Ignored.");
            return;
        }
        
        //keep source for later restoration and checking
        var new_calendar= JSON.parse(tag.innerText);
        new_calendar.unit_map=FictionalTime.createUnitMap(new_calendar.unit_list);
        //generating calendar unit_amval 
            for(let u in new_calendar.unit_map){
                    if(!new_calendar.unit_map.hasOwnProperty(u)){continue;}
                    let unit =new_calendar.unit_map[u]; 
                    unit.unit_amval=FictionalTime.getUnitAmVal(unit.unit_name,new_calendar.unit_map);
                }
        
        //放在這邊才不會發生沒有source有但是Actual沒有的狀況，actual有，就要有source，反之亦然。
        //以避免混淆視聽
        FictionalTime.Calendars.source[calendar_source.calendar_name]=calendar_source;
        FictionalTime.Calendars.actual[new_calendar.calendar_name]=new_calendar;
    }

    FictionalTime.createUnitMap=function(unit_list){
        var unitMap=new Object();
        for(let i =0;i<unit_list.length;i++){
            unitMap[unit_list[i].unit_name]=unit_list[i];
        }
        return unitMap;
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
        let registered = new Array(); 
        for(let c in FictionalTime.Calendars.actual){
            if(!FictionalTime.Calendars.actual.hasOwnProperty(c)){continue;}
            registered.push(FictionalTime.Calendars.actual[c].calendar_name);    
        }
        if(registered.length!=0){console.log(registered.join(","));}
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

