
# Fraud Detection LiveView

## Purpose of This Example

This example builds on the Fraud Detection example by adding live monitoring, alerting, and aggregation using LiveView.

Fraud is suspected when:
- More than three debit transactions occur in a two-minute window.

The account is moved from **Normal** to **Suspended** in two cases:
- When 3 fraud detection attempts happen.
- If the account balance becomes negative.

> Note: This example uses clustered deployment with cache object management. For unclustered deployments:
> - Replace all `Cluster.DataGrid.CacheLoadConceptByExtId` calls with `Instance.getByExtId`.
> - Update CDD cluster and object management configs accordingly.

---

## Pre-requisites

- TIBCO StreamBase 10.x installed (download from TIBCO eDelivery).
- Basic LiveView Datamart knowledge.

---

## How to Run the Example

### 1. Start LiveView Server

- Linux/Mac:  
  Set `JAVA_HOME`, then go to `SB_HOME/distrib/tibco/bin`. Use `epadmin` to manage nodes.  
  Refer to [StreamBase docs](https://docs.tibco.com/pub/str/10.6.0/doc/html/install/configure-shell.html).

- Windows:  
  Run `sbd.exe` from a StreamBase Command Prompt.

- Install and start the node:

```bash
cd SB_HOME/distrib/tibco/bin
epadmin install node nodename=A.fdlv-dep application={path_to_application.zip} nodedirectory={path_to_logs_dir}
epadmin servicename=fdlv-dep start node
````

* Check logs at `{nodedirectory}/A.fdlv-dep/logs/*.log` for "all tables loaded".

* Access LiveView web UI at: [http://localhost:10080/lvweb](http://localhost:10080/lvweb)
  If it doesn’t load, check node port:

```bash
epadmin display services --servicetype=liveview
```

---

### 2. Start TIBCO BusinessEvents Engine

Open a terminal and run:

```bash
cd BE_HOME/examples/metrics/FraudDetectionLiveView/FraudDetectionLiveView
BE_HOME/bin/be-engine --propFile BE_HOME/bin/be-engine.tra -u default -c FraudDetectionLiveView/FraudDetectionLiveView.cdd FraudDetectionLiveView.ear
```

---

### 3. Create an Account

Send a CreateAccount event with:

```bash
curl -X POST http://localhost:8109/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "AccountId": "Bob",
    "Balance": 20000,
    "AvgMonthlyBalance": 11000,
    "City": "Palo Alto",
    "State": "CA",
    "event": "CreateAccount"
  }'
```

Expected response in BE engine logs:

* `#### Created account Bob.`
* Or if duplicate: `#### Account already exists: Bob`

---

### 4. Debit the Account

Send a Debit event:

```bash
curl -X POST http://localhost:8109/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "AccountId": "Bob",
    "Amount": 2000,
    "event": "Debit"
  }'
```

Example log messages:

| Action                                      | Message                                                        |
| ------------------------------------------- | -------------------------------------------------------------- |
| Debit amount less than balance              | `#### Debiting account Bob by $2000.0`                         |
| Debit amount greater than balance           | `#### Account ID Bob STATUS set to Suspended. Balance <0`      |
| Debit suspended account                     | `#### Cannot debit the suspended account Bob`                  |
| 3 debits within 2 minutes - fraud suspected | `#### Account ID Bob. Fraud suspected, Attempt [1]`            |
| After 3 fraud attempts, account suspended   | `#### Account ID Bob STATUS set to Suspended. Fraud detected.` |

---

### 5. Unsuspend the Account (Optional)

Send an Unsuspend event:

```bash
curl -X POST http://localhost:8109/Channels/HTTP/AllOps \
  -H "Content-Type: application/json" \
  -d '{
    "AccountId": "Bob",
    "event": "Unsuspend"
  }'
```

Expected log message:

* `#### Account ID Bob STATUS set to Normal.`

---

### 6. Monitor LiveView Web

Perform operations and observe charts updating live at [http://localhost:10080/lvweb](http://localhost:10080/lvweb)

---

### 7. Reset Data

Restart the engine to reset the cache and data.

---

### 8. Stop LiveView Servers

For SB 10.x:

```bash
epadmin servicename=fdlv-dep stop node
epadmin servicename=fdlv-dep remove node
```

