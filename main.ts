enum RadioMessage {
    message1 = 49434
}
input.onButtonPressed(Button.A, function () {
    control2 = false
    basic.clearScreen()
    for (let value of list) {
        basic.showString("" + (value))
        basic.pause(1000)
        basic.clearScreen()
    }
    control2 = true
})
input.onButtonPressed(Button.AB, function () {
    isCovid = 1
})
radio.onReceivedValue(function (name, value) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    if (control2) {
        led.plotBarGraph(
        Math.map(signal, -95, -42, 0, 9),
        9
        )
    }
    if (name == "id") {
        tempId = value
        if (Math.map(signal, -95, -42, 0, 9) > 3.87) {
            serial.writeLine("TOO CLOSE TO " + value)
            if (list.indexOf(value) == -1) {
                list.push(value)
            }
        }
    }
    if (name == "isCovid") {
        if (value == 1 && list.indexOf(tempId) != -1) {
            isCovid = 1
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `)
            basic.pause(1000)
            basic.showString(convertToText(list[0]).substr(0, 1))
            basic.pause(1000)
        }
    }
})
let tempId = 0
let signal = 0
let control2 = false
let list: number[] = []
let isCovid = 0
let id = control.deviceSerialNumber()
isCovid = 0
list = []
control2 = true
radio.setGroup(1)
radio.setTransmitPower(1)
basic.forever(function () {
    radio.sendValue("id", id)
    radio.sendValue("isCovid", isCovid)
    basic.pause(200)
})
