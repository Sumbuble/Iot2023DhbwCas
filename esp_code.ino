#include <PubSubClient.h>
#include <WiFi.h>

#define PIN_TRIG_1 13
#define PIN_ECHO_1 12

#define PIN_TRIG_2 14
#define PIN_ECHO_2 27

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

const char broker[] = "mq.jreichwald.de";
int        port     = 1883;
const char mqttUser[] = "dhbwcas";
const char mqttPassword[] = "dhbwcas";
const char topic[]  = "real_unique_topic";
const char topic2[]  = "real_unique_topic_2";
const char topic3[]  = "real_unique_topic_3";

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  pinMode(PIN_TRIG_1, OUTPUT);
  pinMode(PIN_ECHO_1, INPUT);
  pinMode(PIN_TRIG_2, OUTPUT);
  pinMode(PIN_ECHO_2, INPUT);

  // Connect to Wifi
  Serial.print("Connecting to WiFi");
  WiFi.begin("Wokwi-GUEST", "", 6);
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println(" Connected!");
  Serial.println();


  // Connect to MQTT Broker
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);

  mqttClient.setServer(broker, port);
  mqttClient.setKeepAlive(60);

  while (!mqttClient.connected()) {
    Serial.println("Connecting to MQTT...");
    if (mqttClient.connect("restmuelltonne", mqttUser, mqttPassword )) {
      Serial.println("connected to MQTT");
    } else {
      Serial.print("failed with state ");
      Serial.print(mqttClient.state());
      delay(2000);
    }
  }
}

void loop() {

  long distanceValue = getBinLevel();
  Serial.print("Average Distance: ");
  Serial.println(distanceValue);

  String distance_str;
  char distance[50];
  distance_str = String(distanceValue); //converting ftemp (the float variable above) to a string
  distance_str.toCharArray(distance, distance_str.length() + 1); //packaging up the data to publish to mqtt

  boolean r = mqttClient.publish("restmuell/fuellstand", distance);
  Serial.print("MQTT Success: ");
  Serial.println(r);
  
  delay(1000);
}

long microsecondsToCentimeters(long microseconds) {
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the object we
  // take half of the distance travelled.
  return microseconds / 29 / 2;
}

long getBinLevel()
{
  // Start a new measurement

  long distance_1 = getDistanceSensorValue(PIN_TRIG_1, PIN_ECHO_1);

  delayMicroseconds(5);

  long distance_2 = getDistanceSensorValue(PIN_TRIG_2, PIN_ECHO_2);

  long avgDistance = (distance_1 + distance_2) / 2;
  return avgDistance;
}

long getDistanceSensorValue(int Trig_Pin, int Echo_Pin)
{
  // Start a new measurement
  digitalWrite(Trig_Pin, LOW);
  delayMicroseconds(2);
  digitalWrite(Trig_Pin, HIGH);
  delayMicroseconds(10);
  digitalWrite(Trig_Pin, LOW);

  // Read the result:
  long duration = pulseIn(Echo_Pin, HIGH);
  long distance = microsecondsToCentimeters(duration);

  return distance;
}
