//這個檔案主要存放作為範例使用的物件，以及相關說明，非測試環境可以不用引入
//應該被放在FictionalTime.js之後載入
(
function(){
    var example = {}
    Window.FictionalTime.example=example;

    example.calendar_def={
        "calendar_name" : "ExampleCalendar" // 這個曆法的名稱
        //這個曆法上面所含的所有單位的清單
        ,"unit_list" : [
            {
                "unit_name" : "Ex-Unit-03" //單位的名稱
                ,"volume_type" : "accumulate" 
                ,"unit_volume" : 72 //單位的數量，本單位由多少 "單位" 組成，
                                    //此處標示Ex-Unit-03由 72個 Ex-Unit-02 組成
                                    //，所有曆法都必須要有一個能夠指向AM的單位
                ,"consist_of" : "Ex-Unit-02" // 這個單位的計量單位
            }
            ,{
                "unit_name" : "Ex-Unit-02"
                ,"volume_type" : "periodically" //單位的性質，目前未使用到，此選項目前有兩種參數：
                                                //periodically：會有週期性的單位，如 年、月
                                                //accumulate : 堆疊式的單位，如：分鐘、秒、小時等
                ,"unit_volume" : 64
                ,"consist_of" : "Ex-Unit-01"
            }
            ,{
                "unit_name" : "Ex-Unit-01"
                ,"volume_type" : "accumulate" 
                ,"unit_volume" : 1999
                ,"consist_of" : "Ex-Unit-00"
            }
            ,{
                "unit_name" : "Ex-Unit-00"
                ,"volume_type" : "accumulate"
                ,"unit_volume" : 19230
                ,"consist_of" : "AM" // AM = "A"bsolute "M"inimum，為這個系統的最小計算單位
                                    //，不可再分割
                                    //每個曆法都必須要有一個能夠指向AM的單位。 
            }

        ]
    }
    

}()


)

