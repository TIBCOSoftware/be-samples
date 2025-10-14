# MQTT Channel – TIBCO BusinessEvents® Example

## Overview

This example demonstrates how **TIBCO BusinessEvents®** uses the **MQTT channel** to send and receive events. The example simulates temperature control across different building floors using MQTT-based communication between a publisher and BusinessEvents agents.

---

## Use Case

Imagine a building with multiple floors where each floor can have its temperature set. This project simulates:

* A mobile app or device publishing "SetTemperature" events via MQTT.
* BusinessEvents subscribing to floor-specific topics, processing the event, and replying.
* A demonstration of request-reply behavior using `Event.requestEvent` and `Event.replyEvent`.

---

## Requirements

* A local or accessible MQTT broker at `tcp://localhost:1883`
* TIBCO BusinessEvents installed
* MQTT Java client library (`mqtt-1.0.0.jar`) placed at `BE_HOME/lib/ext/tpcl/contrib/`

---

## Running the Basic Example (Publish-Subscribe)

### 1. Start MQTT Broker

Ensure that a broker is running locally on port `1883`.

### 2. Start the Client Agent

```bash
cd BE_HOME/examples/standard/MQTTChannel
BE_HOME/bin/be-engine --propFile BE_HOME/bin/be-engine.tra -u client -c MQTTChannel/mqtt.cdd MqttChannel.ear
```

### 3. Compile and Run the Publisher

```bash
cd BE_HOME/examples/standard/MQTTChannel
javac -cp BE_HOME/lib/ext/tpcl/contrib/mqtt-1.0.0.jar -d . TemperaturePublisher.java
java -cp .:BE_HOME/lib/ext/tpcl/contrib/mqtt-1.0.0.jar com.tibco.mqtt.samples.TemperaturePublisher firstfloor
```

> To use a different broker URL:

```bash
java -cp .:BE_HOME/lib/ext/tpcl/contrib/mqtt-1.0.0.jar com.tibco.mqtt.samples.TemperaturePublisher firstfloor tcp://<your-broker-url>
```

---

### Sample Output from Client Agent

```text
SetTemperature rule triggered
Setting floor temperature and notifying
SetTemperature rule complete
ReceiveNotify rule triggered
Received message is - Temperature set
ReceiveNotify rule complete
```

---

## Running the Example with Request/Reply Pattern

This demonstrates how to use `requestEvent` and `replyEvent`.

### 1. Start MQTT Broker (if not already running)

Ensure the broker is available at `tcp://localhost:1883`.

### 2. Start the Client Agent

```bash
cd BE_HOME/examples/standard/MQTTChannel
BE_HOME/bin/be-engine --propFile BE_HOME/bin/be-engine.tra -u client -c MQTTChannel/mqtt.cdd MqttChannel.ear
```

### 3. Start the Server Agent (with unique client ID)

Use a separate `client.properties` file to define a different MQTT client ID.

```bash
cd BE_HOME/examples/standard/MQTTChannel
BE_HOME/bin/be-engine --propFile BE_HOME/bin/be-engine.tra -u server -c MQTTChannel/mqtt.cdd -p client.properties MqttChannel.ear
```

### 4. Run the Publisher for Second Floor

```bash
cd BE_HOME/examples/standard/MQTTChannel
javac -cp BE_HOME/lib/ext/tpcl/contrib/mqtt-1.0.0.jar -d . TemperaturePublisher.java
java -cp .:BE_HOME/lib/ext/tpcl/contrib/mqtt-1.0.0.jar com.tibco.mqtt.samples.TemperaturePublisher secondfloor
```

> Or specify a different broker:

```bash
java -cp .:BE_HOME/lib/ext/tpcl/contrib/mqtt-1.0.0.jar com.tibco.mqtt.samples.TemperaturePublisher secondfloor tcp://<your-broker-url>
```

---

### Sample Output

#### Client Agent

```text
RequestEvent rule triggered
Requesting Event
Temperature set in reply event rule
RequestEvent rule complete
```

#### Server Agent

```text
ReplyEvent rule triggered
Setting floor temperature and replying
ReplyEvent rule complete
```

---

## Additional Notes

* MQTT topics and broker URL can be configured in the `.cdd` file or via Global Variables.
* Use a different MQTT client ID for each BusinessEvents agent connecting to the broker.
* Ensure the publisher is targeting the correct topic (`firstfloor`, `secondfloor`, etc.)
