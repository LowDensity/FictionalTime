//設計中的Fictional Time

//prototype for calendar class
var time_unit={
    "schema" :{    
        "order" :[
            "year"
            ,"day"
            ,"hour"
            ,"minute"
            ,"second"
        ]
    },
    "second":{
        "volume" : 1000,
        "volume_type" : "accumulate",
        "unit_type": "AM" // AM = Absolute Minimum   
    },
    "minute":{
        "volume" : 60,
        "volume_type" : "accumulate",
        "unit_type":"second"
    },
    "hour":{
        "volume" :  60 ,
        "volume_type" : "accumulate",
        "unit_type":"minute",
    },
    "day":{
        "volume" :17,
        "volume_type" : "accumulate",
        "unit_type" :"hour"
    },
    "year":{
        "volume" :553,
        "volume_type" : "periodically",
        "unit_type" :"day"
    }
}

function FictionalTime(){}

FictionalTime.prototype.getValue=
    function(request){
        var start= new Date();
        console.log("Start Time : " +start.getTime());
        var unitDefinition=time_unit[request.unit_name];
        var curStamp= request.timestamp;
        for(
            var unitVal=0;
            curStamp > unitDefinition.volume ;
            ((curStamp-=unitDefinition.volume) & unitVal++) 
        );
        var end = new Date();
        
        console.log("End Time : " +end.getTime() );
        console.log("Elapsed Time : "+ (end.getTime()-start.getTime()));

        return {
            "unit_name":unitDefinition.name,
            "unit_value" : unitVal
        }
    }

//translate bigger unit to base unit
FictionalTime.prototype.getAmVal=
    function(unit_name,calendar){
        var unitDef = calendar[unit_name];
        var amVal = unitDef.volume;
        var baseUnit = calendar[unitDef.unit_type];
        while(typeof(baseUnit)!="undefined"){
            amVal = amVal*baseUnit.volume;
            baseUnit = calendar[baseUnit.unit_type]; 
        }
        return amVal;
    }

window.ft=new FictionalTime();


