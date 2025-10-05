# LiveScore – TIBCO BusinessEvents® Example

## Overview

This example demonstrates how to use **TIBCO BusinessEvents®** to send a SOAP-based request to **LiveScore** for executing a predictive model using test data. The request is constructed using event properties and sent via the HTTP channel to the LiveScore API.

The response returned from LiveScore contains the model’s prediction based on the submitted event data.

---

## Prerequisites

* TIBCO BusinessEvents® installed
* LiveScore server deployed and accessible
* EAR file located in the correct example directory

---

## Project Purpose

* Send a sample **Statistica Event** from BusinessEvents to LiveScore via HTTP
* Receive a **prediction response** from LiveScore, based on a preconfigured workflow (WFID)

---

## How to Run the Example

### 1. Start the BusinessEvents Engine

Open a terminal or command prompt and execute:

```bash
cd <BE_HOME>/examples/standard/Analytics/LiveScore
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u default -c LiveScore/LiveScore.cdd LiveScore.ear
```

> Replace `<BE_HOME>` with your actual TIBCO BusinessEvents installation directory.

---

### 2. Send a Statistica Event to Trigger LiveScore Evaluation

This event triggers the LiveScore workflow and returns a prediction result.

#### Sample `curl` Command (HTTP Request):

```bash
curl -X POST http://localhost:8108/Channels/HTTP/StatisticaOps \
  -H "Content-Type: application/json" \
  -d '{
    "_eventType": "/Events/StatEvent",
    "ClearCache": "1",
    "Duration_of_Credit": "36",
    "Purpose_of_Credit": "retraining",
    "Amount_of_Credit": "3003",
    "Marital_Status": "single",
    "Gender": "female",
    "Age": "32",
    "Occupation": "skilled employee",
    "Credit_Rating": "good",
    "Living_in_Current_Household_for": "5-8 years",
    "WFID": "/Template/CreditScoring_WoE_Example"
  }'
```

> Ensure the port number (`8108`) and endpoint (`/Channels/HTTP/StatisticaOps`) match your actual HTTP channel configuration in the `.cdd`.

---

### 3. Observe the Output

When the event is processed, you will see console output similar to:

```
Sending Statistica Event
Answer received from the event is: { ... }
```

The returned JSON contains the prediction or scoring result from LiveScore.

---

### 4. Reset Data

To reset the example, stop and restart the BE engine:

```bash
<BE_HOME>/bin/be-engine ...
```

---

## Notes

* Make sure the `WFID` points to a valid LiveScore workflow that exists and is deployed.
* Adjust HTTP properties or the BE `.cdd` file if your deployment environment differs from the example.
* This example uses SOAP over HTTP. Ensure your LiveScore server supports this interface and has CORS or security configurations if needed.

---
