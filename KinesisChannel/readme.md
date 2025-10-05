
# KinesisChannel – TIBCO BusinessEvents® Example

## Overview

This example demonstrates how **TIBCO BusinessEvents®** integrates with **Amazon Kinesis** using the Kinesis Channel. It shows how BusinessEvents can **send** and **receive** event data via AWS Kinesis streams.

You can explore the configuration and logic in **TIBCO BusinessEvents Studio** for implementation details.

---

## Project Description

* The **Producer Agent** sends data records (events) to a Kinesis data stream.
* The **Consumer Agent** subscribes to the Kinesis stream and processes incoming stock events.
* The producer is triggered at regular intervals.
* The consumer processes each `StockEvent` using the `ProcessStockRule`.

---

## Requirements

* AWS Account with permissions to create and access **Kinesis Data Streams**.
* Kinesis Streams configured appropriately.
* IAM User and Policy set up with access keys for BusinessEvents Kinesis integration.
* All required AWS and Kinesis properties configured in the `.cdd` file of the project.

---

## How to Run the Example

### 1. Set up AWS Resources

* Create a **Kinesis data stream** in AWS.
* Create an **IAM user** and **policy** that allows access to the Kinesis stream.
* Obtain AWS Access Key and Secret Key and configure them in the `.cdd`.

### 2. Start the Consumer Agent

```bash
cd <BE_HOME>/examples/standard/KinesisChannel
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u consumer -c KinesisChannel/kinesis.cdd KinesisChannel.ear
```

### 3. Start the Producer Agent

```bash
cd <BE_HOME>/examples/standard/KinesisChannel
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u producer -c KinesisChannel/kinesis.cdd KinesisChannel.ear
```

---

## Sample Output

### Consumer Agent Output

```
#### Stock Details Received - Ticker Symbol: NVDA Trade Type: BUY
#### Stock Details Received - Ticker Symbol: APPL Trade Type: SELL
...
```

Additional debug logs will show rule processing and shard checkpointing.

### Producer Agent Output

```
#### Stock Details Sent - Ticker Symbol: NVDA Trade Type: BUY
#### Stock Details Sent - Ticker Symbol: APPL Trade Type: SELL
...
```
