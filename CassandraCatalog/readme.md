# Cassandra Store Catalog Functions Example

## Purpose of This Example

This example demonstrates the use of various Store Catalog functions APIs to provide communication with the Cassandra store.

Features covered:

* Fetching metadata of the configured store
* Put/Get/Delete/Query operations on Entities (Concept/Events) against the store
* Manual creation of items and performing Put/Get/Delete/Query on them against the store
* Running store operations within a transaction

**Note:** The application uses Store APIs and can be used with external **Apache Cassandra**.

---

## Pre-requisites

* Install Apache Cassandra server (Apache Cassandra 4.x and above) - (To run this example with Apache Cassandra)

---

## How to Run the Example

1. **Update** `be-engine.tra` and `studio.tra` (`BE_HOME/studio/eclipse/configuration/studio.tra`).

2. **Setup Apache Cassandra store (To run this example with Apache Cassandra).**

   * Implementation of Cassandra Store Catalog functions is available at:
     [https://github.com/TIBCOSoftware/be-contribution/tree/main/catalog/cassandra-catalog-fn](https://github.com/TIBCOSoftware/be-contribution/tree/main/catalog/cassandra-catalog-fn)
   * Build the project as mentioned in:
     [https://github.com/TIBCOSoftware/be-contribution/tree/main/catalog/README.md](https://github.com/TIBCOSoftware/be-contribution/tree/main/catalog/README.md) (using Maven goal `install`)
   * The generated `cassandra-catalog-fn-X.X.X.jar` will be available inside the `target` directory.
   * Start BusinessEvents Studio and open your project.
   * Add `cassandra-catalog-fn-X.X.X.jar` to your Build Path. This enables the new catalog functions inside **Catalog Functions -> Custom Functions** view in Studio.

3. **Start Apache Cassandra store**

   ```bash
   # Change directory
   cd be-samples-dir/standard/CassandraCatalog/scripts

   # Make sure your Apache Cassandra server is running.

   # Create keyspace 'storefunctions' with user credentials be_user/BE_USER.

   # Execute CQL script:
   $CASSANDRA_HOME/bin/cqlsh -k storefunctions -f ./storefunctions.cql
   ```

4. **Start the TIBCO BusinessEvents engine**

   ```bash
   cd be-samples-dir/CassandraCatalog

   BE_HOME/bin/be-engine --propFile BE_HOME/bin/be-engine.tra -u default -c CassandraCatalog/Deployments/Cassandra.cdd CassandraCatalog.ear
   ```

   Adapt the command as needed, e.g., if you have customized the example project or run it from a different directory.

---

## Usage and `curl` Requests

### 1. Show Store Metadata

Show the store metadata by sending an empty POST request.

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/metadata \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 2. Create Employee (Put Employee)

Create an employee with the following details:

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/put \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob",
    "age": 25,
    "isPermanant": true,
    "salary": 500.00,
    "homePhone": "212-313-4114",
    "mobilePhone": "400-300-4000",
    "address": "Palo Alto, California",
    "alternateAddress": "Mountain View, California",
    "departments": "Sales, HR"
  }'
```

---

### 3. Get Employee Details

Get details for an employee by `empId`. Optionally include `addressId` and `phoneId` to retrieve associated entities.

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/get \
  -H "Content-Type: application/json" \
  -d '{
    "empId": "679241819293221",
    "addressId": "679241818009414,679241818947365",
    "phoneId": "679241819072128"
  }'
```

* To fetch only employee details (without address and phone):

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/get \
  -H "Content-Type: application/json" \
  -d '{"empId": "679241819293221"}'
```

---

### 4. Query Employee Details

Query employees based on filter criteria (e.g., age > 20):

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/query \
  -H "Content-Type: application/json" \
  -d '{"age": 20}'
```

---

### 5. Delete Employee

Delete an employee and optionally associated entities by IDs:

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/delete \
  -H "Content-Type: application/json" \
  -d '{
    "empId": "679241819293221",
    "addressId": "679241818009414,679241818947365",
    "phoneId": "679241819072128"
  }'
```

---

### 6. Phone Transaction

Perform phone-related operations within a transaction:

```bash
curl -X POST \
  http://localhost:4545/Channels/HTTPChannel/phoneTransaction \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Notes

* Replace IDs like `"679241819293221"` with actual IDs from your data.
* The server is assumed to be running locally on port `4545`.
* Modify the JSON payloads to fit your real use case.
* Ensure your Apache Cassandra server and TIBCO BusinessEvents engine are running before making these requests.

---
