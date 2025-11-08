# PMML Audit Example

## Purpose of This Example

This example demonstrates how PMML functions can be invoked in **TIBCO BusinessEvents®**.  
You can examine the project in TIBCO BusinessEvents Studio to understand the setup.  
The scenario uses an audit data dataset from the PMML examples at:  
http://dmg.org/pmml/pmml_examples/index.html#Audit

---

## How to Run the Example

1. Open a command window and at the command prompt, start the TIBCO BusinessEvents engine using the following command. Substitute your actual value for `BE_HOME`.

    ```bash
    cd BE_HOME/examples/standard/Analytics/AuditPMML
    BE_HOME/bin/be-engine --propFile BE_HOME/bin/be-engine.tra -u default -c AuditPMML/Deployments/pmml.cdd AuditPMML.ear
    ```

    > Adapt these commands as needed, for example, if you have customized the example project or are running it from a different directory.

2. Create a fictional client using the following data and send it to the server. Change the values and repeat this step to send multiple events, as desired.

    **Event Path:** `/Events/ClientData`  
    **Send To:** `http://localhost:8308/Channels/HTTP/ClientData`

    Example `curl` command to send this data:

    ```bash
    curl -X POST http://localhost:8308/Channels/HTTP/ClientData \
         -H "Content-Type: application/json" \
         -d '{
               "Age": 20,
               "Employment": "Private",
               "Education": "College",
               "Marital": "Unmarried",
               "Occupation": "Service",
               "Income": 81838,
               "Gender": "Female",
               "Deductions": 0,
               "Hours": 72
             }'
    ```

    In the command window, you will see the predicted output from the model:

    ```
    Target=0, Age=20, Employment=Private, Education=College, Marital=Unmarried, Occupation=Service, Income=81838.0, Gender=Female, Deductions=0.0, Hours=72
    ```

3. If you want to predict the target field for all the data in the `Audit.csv` file, send the following event. The output is written to `out.csv` with the predicted target value.

    **Event Path:** `/Events/LoadBulkData`  
    **Send To:** `http://localhost:8308/Channels/HTTP/LoadBulkData`

    Example `curl` command:

    ```bash
    curl -X POST http://localhost:8308/Channels/HTTP/LoadBulkData \
         -H "Content-Type: application/json" \
         -d '{}'
    ```

    The output is written to the CSV file:

    ```
    BE_HOME/examples/standard/Analytics/AuditPMML/resources/out.csv
    ```

---
