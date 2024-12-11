#include <ModbusRTU.h>
#include <HardwareSerial.h>

HardwareSerial RS485Serial(1); // Use UART1 for RS-485
ModbusRTU mb;

const int RS485_DIR = 22; // Pin for RS-485 direction control
const uint8_t slaveID = 1; // Set according to your DTB4848CR device configuration
const uint16_t registerAddress = 0x0000; // Adjust according to the DTB4848CR manual

void setup() {
    Serial.begin(115200);
    RS485Serial.begin(9600, SERIAL_8N1, 16, 17); // RX, TX pins for RS-485
    mb.begin(&RS485Serial, RS485_DIR);
    mb.master();
    pinMode(RS485_DIR, OUTPUT); // RS-485 direction control
}

void sendTemperatureToDTB(float temperature) {
    uint16_t scaledTemp = (uint16_t)(temperature * 10); // Scale temperature for register
    if (!mb.writeHreg(slaveID, registerAddress, scaledTemp)) {
        Serial.println("Failed to send temperature to DTB!");
    } else {
        Serial.println("Temperature sent successfully!");
    }
}

void loop() {
    mb.task();
    delay(100);
}
