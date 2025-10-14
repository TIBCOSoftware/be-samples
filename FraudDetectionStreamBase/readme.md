
# StreamBaseChannel - TIBCO BusinessEvents® Example

## Purpose of This Example

This example demonstrates how the **StreamBase channel** integrates **TIBCO BusinessEvents®** with **TIBCO StreamBase® CEP**.

Fraud detection is triggered when:

* An account has **more than 3 debits** in **2 minutes**, and
* The **total of those debits exceeds 80%** of the average monthly balance.

> **Note:** Use **Chrome** or **Firefox** to view the HTML form with the "Send" button.

---

## How to Run the Example

> **Requirements**:
>
> * TIBCO BusinessEvents
> * TIBCO StreamBase

---

### 1. Start StreamBase Application

Launch StreamBase as appropriate (via command line or StreamBase Studio).
See: [StreamBase Test/Debug Guide](https://docs.tibco.com/pub/str/10.6.0/doc/html/testdebug/index.html)

---

### 2. Start BusinessEvents Engine

```bash
cd <BE_HOME>/examples/standard/FraudDetectionStreamBase
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u default -c FraudDetectionStreamBase/fdsb.cdd fdsb.ear
```

> Replace `<BE_HOME>` with your actual installation path.

---

## Interacting via HTTP (cURL)

The HTTP channel is exposed at:

```
http://localhost:8108/Channels/HTTP/AllOps
```

### 3. Create an Account

```bash
curl -X POST http://localhost:8108/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "_eventType": "/Events/CreateAccount",
    "AccountId": "Bob",
    "Balance": 10000,
    "AvgMonthlyBalance": 20000
  }'
```

> Expected response in logs:

```text
#### Created account Bob.
```

---

### 4. Debit the Account

```bash
curl -X POST http://localhost:8108/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "_eventType": "/Events/Debit",
    "AccountId": "Bob",
    "Amount": 2000
  }'
```

> Expected response:

```text
#### Debiting account Bob by $2000.0
```

---

## Behavior Scenarios

| Scenario                      | Example                                                  | Response                                                                                                |
| ----------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Create the same account twice | Repeat the create cURL                                   | `#### Account already exists: Bob`                                                                      |
| Debit exceeds balance         | Amount > Balance                                         | `#### Account ID Bob STATUS set to Suspended. Balance -1000.0 is less than zero`                        |
| Debit suspended account       | Any debit after above                                    | `#### Cannot debit the suspended account Bob`                                                           |
| Trigger fraud detection       | 3+ debits in 2 mins and total > 80% of AvgMonthlyBalance | `#### Account ID Bob STATUS set to Suspended. Reason: 80.0% of monthly average exceeded in 120 seconds` |

---

### 5. Reset the Engine

To reset the data/facts, **restart the BusinessEvents engine**:

```bash
# Example (from project directory)
<BE_HOME>/bin/be-engine --propFile <BE_HOME>/bin/be-engine.tra -u default -c FraudDetectionStreamBase/fdsb.cdd fdsb.ear
```
