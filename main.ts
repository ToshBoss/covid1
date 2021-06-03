enum RadioMessage {
    message1 = 49434
}

//Display List of People that Have been in close contact recently WITH ANYONE. 
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

//Broadcast a positive case.
input.onButtonPressed(Button.AB, function () {
    isCovid = 1
})

//When recieved the global list, update any new entries and broadcast
radio.onReceivedString(function (receivedString) {
    // let temp = JSON.parse(receivedString)
    if (true) {
        temp = receivedString.split(",")
        temp.forEach(function (value) {
            if(globalList.indexOf(value) == -1){
                globalList.push(value)
                serial.writeLine("hewwo " + value)   
            }
        });
    }

})

//show bar graph output
radio.onReceivedValue(function (name, value) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    if (control2) {
        led.plotBarGraph(
        Math.map(signal, -95, -42, 0, 9),9)
    }
    //check if closest contact has had Covid to see if prev. exposed
    if(name == 'id'){
        serial.writeLine("HELLO" + value)
        tempId = value;
      if (Math.map(signal, -95, -42, 0, 9) > 3.87) {
            closeList.push("" + value);
        }
    }
    
    //??
    if (name == "isCovid") {
        if (value == 1 && closeList.indexOf(("" + tempId)) != -1) {
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
    }
})
let signal = 0
let temp: string[] = []
let control2 = false
let isCovid = 0
let i = 0
let globalList: string[] = []
let closeList: string[] = []

let tempId = 0
let id = control.deviceSerialNumber()
isCovid = 0
globalList = []
control2 = true
let tempList = [control.deviceSerialNumber().toString()]
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
