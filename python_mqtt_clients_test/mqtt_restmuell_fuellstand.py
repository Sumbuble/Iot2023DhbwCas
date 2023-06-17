import paho.mqtt.client as mqtt
import threading
from random import randint

def on_connect(client, userdata, flags, rc):
    """ Callback function on inital (re-)connect"""
    print("Connected with result code "+str(rc))
    client.publish('client1/status', 'online', retain=True)

# Create client
client = mqtt.Client('restmuell_fuellstand', protocol=mqtt.MQTTv311)
# Optional: client.username_pw_set("user", "password")
client.will_set("client1/status", "offline", retain=True)
client.on_connect = on_connect

def random_temp_publish():
    threading.Timer(randint(1, 10), random_temp_publish).start()
    client.publish('restmuell/fuellstand', randint(0, 100), retain=True)

random_temp_publish()

# Connect and (blocking) loop
client.connect("localhost")

# Use loop_start()/loop_end() in a separate thread
client.loop_forever()