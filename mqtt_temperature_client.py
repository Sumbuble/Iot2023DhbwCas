#!python3
import paho.mqtt.client as mqtt
import threading
from random import randint

# BEGIN-SNIPPET
# Callback function on inital (re-)connect


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.publish('homeassistant/sensor/temperatureRoof/config', 
               '{"device_class": "temperature", "name": "Temperature", "state_topic": "homeassistant/sensor/temperatureRoof/state" }', 
               retain=True)

# Create client
client = mqtt.Client('temperatursensor_dach')
client.on_connect = on_connect



def random_temp_publish():
    threading.Timer(randint(1, 10), random_temp_publish).start()
    client.publish('homeassistant/sensor/temperatureRoof/state', str(randint(18, 26)), retain=True)


random_temp_publish()

# Connect and (blocking) loop
client.connect("localhost")
client.loop_forever()