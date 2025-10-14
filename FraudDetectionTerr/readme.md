
# Fraud Detection TERR - TIBCO BusinessEvents® Example

## Overview

This example demonstrates a **Fraud Detection** scenario using **TIBCO BusinessEvents®** with **TIBCO Enterprise Runtime for R (TERR)**.

Fraud detection is a commonly used Complex Event Processing (CEP) use case, as it highlights how a CEP engine can correlate multiple events over time using windows and threshold logic.

Fraud is suspected when **either** of the following conditions is met:

* The account incurs **more than three debit transactions** in a **two-minute period**.
* The **total of the debits** within two minutes exceeds **80% of the average monthly balance** of the account.

**Note:** Use Google Chrome or Mozilla Firefox to view the Send Button if using the original `readme.html` interface.

---

## Prerequisites

Before running this example, update the following environment variable in the BusinessEvents engine configuration:

```properties
tibco.env.TERR_HOME
```

Set this in:

```
<BE_HOME>/bin/be-engine.tra
```

Ensure it points to your **TERR installation** directory.

---

## Running the Example

### 1. Start the BusinessEvents Engine

Open a terminal and run the following command:

```bash
cd <BE_HOME>/examples/standard/FraudDetectionTerr
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u default -c FraudDetectionTerr/fdterr.cdd fdterr.ear
```

> Replace `<BE_HOME>` with your actual TIBCO BusinessEvents installation path.
> Adjust the command as needed if you have modified the example or are using a different working directory.

---

## Sending Events via HTTP (Using `curl`)

The HTTP channel for this example listens on:

```
http://localhost:8117/Channels/HTTP/AllOps
```

### 2. Create an Account

```bash
curl -X POST http://localhost:8117/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "_eventType": "/Events/CreateAccount",
    "AccountId": "Bob",
    "Balance": 20000,
    "AvgMonthlyBalance": 11000
  }'
```

Expected log output:

```
#### Created account Bob.
```

---

### 3. Debit the Account

```bash
curl -X POST http://localhost:8117/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "_eventType": "/Events/Debit",
    "AccountId": "Bob",
    "Amount": 2000
  }'
```

Expected log output:

```
#### Debiting account Bob by $2000.0
```

---

## Example Behaviors and Rule Responses

| Action                                                                            | System Response                                                                  |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Create the same account twice                                                     | `#### Account already exists: Bob`                                               |
| Debit amount exceeds balance                                                      | `#### Account ID Bob STATUS set to Suspended. Balance -1000.0 is less than zero` |
| Debit a suspended account                                                         | `#### Cannot debit the suspended account Bob`                                    |
| Trigger fraud (3+ debits in 2 minutes and total > 80% of average monthly balance) | `#### Account ID Bob STATUS set to Suspended. Fraud suspected`                   |

---

## Resetting the Application State

To reset data and start a new test run, restart the engine:

```bash
cd <BE_HOME>/examples/standard/FraudDetectionTerr
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u default -c FraudDetectionTerr/fdterr.cdd fdterr.ear
```
