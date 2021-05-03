enum RadioMessage {
    message1 = 49434
}
input.onButtonPressed(Button.A, function () {
    isCovid = 1
})
radio.onReceivedValue(function (name, value) {
    signal = radio.receivedPacket(RadioPacketProperty.SignalStrength)
    led.plotBarGraph(
    Math.map(signal, -95, -42, 0, 9),
    9
    )
    if (name == "id") {
        tempId = value
        if (Math.map(signal, -95, -42, 0, 9) > 3.87) {
            serial.writeLine("TOO CLOSE TO " + value)
            if (list.indexOf(value) == -1) {
                list.push(value)
                serial.writeLine("" + (list[0]))
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
            serial.writeLine("" + (list[0]))
        }
    }
})
let tempId = 0
let signal = 0
let list: number[] = []
let isCovid = 0
let id = control.deviceSerialNumber()
isCovid = 0
list = []
radio.setGroup(1)
radio.setTransmitPower(1)
basic.forever(function () {
    radio.sendValue("id", id)
    radio.sendValue("isCovid", isCovid)
    basic.pause(200)
})
