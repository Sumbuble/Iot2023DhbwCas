import paho.mqtt.client as mqtt

def on_connect(client, userdata, flags, rc):
    """ Callback function on inital (re-)connect"""
    print("Connected with result code "+str(rc))
    client.subscribe('client2/status')
    client.publish('client2/status', 'online', retain=True)

def on_message(client, userdata, msg):
    """Callback function on message reception"""
    print(f"{str(msg.payload)=}, {msg.topic=}, {str(msg.qos)=}")

# Create client
client = mqtt.Client('client2')
# Optional: client.username_pw_set("user", "password")
client.will_set("client2/status", "offline", retain=True)
client.on_connect = on_connect
client.on_message = on_message

# Connect and (blocking) loop
client.connect("127.0.0.1", 1883)

# Use loop_start()/loop_end() in a separate thread
client.loop_forever()