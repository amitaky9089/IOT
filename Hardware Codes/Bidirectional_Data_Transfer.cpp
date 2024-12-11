#include <WiFi.h>
#include <PubSubClient.h>
#include <ModbusRTU.h>

// WiFi credentials
const char* ssid = "Amit1";
const char* password = "LOL";

// MQTT broker details
const char* mqtt_server = "192.168.1.100"; // Replace with your MQTT broker's IP
const char* mqtt_topic_sub = "temperature/set"; // Topic to receive temperature settings
const char* mqtt_topic_pub = "temperature/status"; // Topic to publish status

// RS-485 Modbus setup
#define RS485_DIR 4 // GPIO pin for RS-485 direction control
HardwareSerial RS485Serial(2);
ModbusRTU mb;

// Global variables
WiFiClient espClient;
PubSubClient client(espClient);
float currentTemperature = 0.0; // Store the last sent temperature

// Function to send temperature to DTB4848CR
void sendTemperatureToDTB(float temperature) {
    uint16_t tempValue = static_cast<uint16_t>(temperature * 10); // Scale temperature
    mb.writeHreg(1, 0x0001, tempValue); // Adjust register and address as per DTB4848CR
    Serial.print("Sent Temperature to DTB4848CR: ");
    Serial.println(temperature);
}

// Function to read temperature from DTB4848CR
float readTemperatureFromDTB() {
    uint16_t tempValue;
    if (mb.readHreg(1, 0x0002, &tempValue, 1)) { // Adjust register as per DTB4848CR
        return tempValue / 10.0; // Scale back temperature
    }
    return -1.0; // Return -1.0 in case of an error
}

// Callback for MQTT messages
void callback(char* topic, byte* payload, unsigned int length) {
    String message;
    for (int i = 0; i < length; i++) {
        message += (char)payload[i];
    }

    float temperature = message.toFloat(); // Convert received message to temperature
    Serial.print("Received Temperature: ");
    Serial.println(temperature);

    // Send temperature to DTB4848CR
    sendTemperatureToDTB(temperature);
}

// Connect to WiFi
void connectToWiFi() {
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting to WiFi...");
    }
    Serial.println("WiFi connected!");
}

// Connect to MQTT broker
void connectToMQTT() {
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        if (client.connect("ESP32_Client")) {
            Serial.println("Connected to MQTT!");
            client.subscribe(mqtt_topic_sub);
        } else {
            delay(5000);
        }
    }
}

void setup() {
    Serial.begin(115200);

    // RS-485 setup
    RS485Serial.begin(9600, SERIAL_8N1, 16, 17); // RX, TX pins for RS-485
    mb.begin(&RS485Serial, RS485_DIR);
    mb.master();
    pinMode(RS485_DIR, OUTPUT);

    // WiFi and MQTT setup
    connectToWiFi();
    client.setServer(mqtt_server, 1883);
    client.setCallback(callback);
}

void loop() {
    if (!client.connected()) {
        connectToMQTT();
    }
    client.loop();

    // Periodically read temperature from DTB4848CR and publish to MQTT
    static unsigned long lastPublish = 0;
    unsigned long now = millis();
    if (now - lastPublish > 5000) { // Publish every 5 seconds
        float temperature = readTemperatureFromDTB();
        if (temperature >= 0.0) { // Check for valid temperature
            currentTemperature = temperature;
            String payload = String(currentTemperature, 1); // Convert to string with 1 decimal place
            client.publish(mqtt_topic_pub, payload.c_str());
            Serial.print("Published Temperature to MQTT: ");
            Serial.println(payload);
        } else {
            Serial.println("Error reading temperature from DTB4848CR!");
        }
        lastPublish = now;
    }

    mb.task(); // Modbus task handler
    delay(100);
}
