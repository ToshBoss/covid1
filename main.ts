enum RadioMessage {
    message1 = 49434
}
// Display List of People that Have been in close contact recently WITH ANYONE.
input.onButtonPressed(Button.A, function () {
    control2 = false
    basic.clearScreen()
    for (let value of globalList) {
        basic.showString("" + (value))
        basic.pause(1000)
        basic.clearScreen()
    }
    control2 = true
})
// Broadcast a positive case.
input.onButtonPressed(Button.AB, function () {
    isCovid = 1
    globalList.forEach(function (val) {
        if(val.includes(""+ control.deviceSerialNumber())){
            globalList.removeAt(globalList.indexOf(val))
            globalList.push(""+control.deviceSerialNumber() + ", true");
            serial.writeLine("WROTE SMTH")
        }
    });
})
// When recieved the global list, update any new entries and broadcast
radio.onReceivedString(function (receivedString) {
    //serial.writeLine("HELP" + receivedString)
    // let temp = JSON.parse(receivedString)
    if (true) {
        let ff = false;
        temp = receivedString.split(",")
        if(!globalList.join().includes(receivedString)){
            globalList.push(receivedString)
        }
        globalList.forEach(function (val) {
            let x = val.split()
            serial.writeLine("PUSHING" + val)

            
            if(x[1] == "true" && (closeList.join().includes(x[0]))){
                globalList.removeAt(globalList.indexOf(val))
                globalList.push(""+control.deviceSerialNumber() + ", true");
                serial.writeLine("WROTE SMTH")
                //closeList.removeAt(closeList.indexOf(val))
                serial.writeLine("PUSHING" + val)
                closeList.push(val);
            }
         }); 
               closeList.forEach(function (val) {
                   serial.writeLine("CL:OSE" + val)
         });        
    }
})
// show bar graph output
radio.onReceivedValue(function (name, value) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    if (control2) {
        led.plotBarGraph(
        Math.map(signal, -95, -42, 0, 9),
        9
        )
    }
    // check if closest contact has had Covid to see if prev. exposed
    if (name == "id") {
        //serial.writeLine("HELLO" + value)
        tempId = value
        if (Math.map(signal, -95, -42, 0, 9) > 3.87 && closeList.indexOf(("" + value + ", false" )) == -1){
            closeList.push("" + value + ", false")
        }
    }
        if (closeList.join().includes("true")) {
            isCovid = 1
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            basic.pause(1000)
            basic.showString(convertToText(globalList[0]).substr(0, 1))
            basic.pause(1000)
        }
})
let tempId = 0
let signal = 0
let control2 = false
let isCovid = 0
let globalList: string[] = []
let i = 0
let temp: string[] = []
let id = control.deviceSerialNumber()
isCovid = 0
globalList = []
let closeList: string[] = []

control2 = true
let aList = [control.deviceSerialNumber().toString(), "false"]
let tempList = [aList.join()]
globalList.push(tempList.join())
// list.push("0")
radio.setGroup(1)
radio.setTransmitPower(1)
basic.forever(function () {
    radio.sendValue("isCovid", isCovid)
    radio.sendValue("id", id)
    radio.sendString("" + (globalList.join()))
    basic.pause(200)
})
