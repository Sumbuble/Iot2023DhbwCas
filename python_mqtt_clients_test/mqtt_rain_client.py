#!python3
import paho.mqtt.client as mqtt
import threading
from random import randint

# BEGIN-SNIPPET
# Callback function on inital (re-)connect


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))


# Create client
client = mqtt.Client('regensensor_dach')
client.on_connect = on_connect

def random_regen_publish():
    threading.Timer(randint(1, 10), random_regen_publish).start()
    client.publish('regensensor/dach', str(randint(0, 1)), retain=True)


random_regen_publish()

# Connect and (blocking) loop
client.connect("localhost")
client.loop_forever()