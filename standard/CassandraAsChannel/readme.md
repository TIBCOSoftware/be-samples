## What is Cassandra CDC -
Apache Cassandra provides Change Data Capture (CDC) logging to capture and track data that has changed. CDC logging is configured per table, with limits on the amount of disk space to consume for storing the CDC logs. CDC logs use the same binary format as the commit log. 

## More information related to Cassandra CDC can be found at :

https://cassandra.apache.org/doc/latest/cassandra/operating/cdc.html

### How can we leverage Cassandra CDC in order to ingest data in TIBCO BussinessEvents?
We can use DataStax CDC for Apache Cassandra® which can help in reading CDC changes and publishing messages to pulsar topics.

We can then leverage pulsar channel to process messages published on the pulsar topic and ingest events in BE application.

About DataStax CDC for Apache Cassandra®:
DataStax CDC for Apache Cassandra® is open-source software (OSS) that sends Cassandra mutations for tables having Change Data Capture (CDC) enabled to Apache Pulsar™.

### Pre-requisites
Apache Cassandra 4.0+  - Only Cassandra 4.0 supports the near real-time CDC allowing to replicate data as soon as they are synced on disk. 
Apache Pulsar 2.11.0
DataStax CDC for Apache Cassandra (v2.2.3) - 
            CDC for Cassandra has two components:

DataStax Change Agent for Apache Cassandra, which is an event producer deployed as a JVM agent on each Cassandra data node

CDC for Cassandra, which is a source connector deployed in your Pulsar cluster.

### Architecture

Per-table event topics pattern will be used. For each CDC-enabled table, the change agent will send events to the events topic. The topic name is determined by the topicPrefix setting in the agent (default is events-). The <keyspace_name>.<table_name> is appended to the prefix to build the topic name.

## CDC Cassandra - Pulsar setup 
Start Cassandra with the Change Agent for Cassandra
All data nodes of the Cassandra datacenter must run the change agent as a JVM agent to send mutations into the events topic. Start Cassandra nodes with the appropriate producer binary.

 The CDC agent Pulsar connection parameters were provided as extra JVM options after the jar name in the form of a comma-separated list of paramName=paramValue. The same JVM option is now appended to cassandra-env.sh as below: 

```JVM_EXTRA_OPTS="-javaagent:/home/rakulkar/C/softwares/cassandra-source-agents-2.2.3/agent-c4-2.2.3-all.jar=pulsarServiceUrl=pulsar://localhost:6650"```
```JVM_OPTS="$JVM_OPTS $JVM_EXTRA_OPTS"```

#### Changes in Cassandra.yaml
In addition to configuring the change agent, enable CDC on the Cassandra node by setting cdc_enabled to true in the cassandra.yaml file. For Cassandra 4.X users can configure the commit log sync period. This parameter controls how often the commit logs are made available for CDC processing. The default is 10 seconds. To reduce the latency from when the table is updated to when the event is available in the data topic, decrease the period, such as 2 seconds.

Here is an example set of configurations for the cassandra.yaml file:
```cdc_enabled: true```
```commitlog_sync_period_in_ms: 2000```
```cdc_total_space_in_mb: 50000```

#### Enabling and disabling CDC on a table
Enable or disable CDC on a table using the following commands:
```CREATE TABLE foo (a int, b text, c text, PRIMARY KEY(a)) WITH cdc=true;```
```ALTER TABLE foo WITH cdc=true;```
```ALTER TABLE foo WITH cdc=false;```

#### Deploy pulsar connector NAR file in the Pulsar cluster
To deploy the CDC for Cassandra NAR file in your Pulsar cluster, upload it to Pulsar using the pulsar-admin sources create command. Users need to deploy CDC for Cassandra NAR for each CDC-enabled table ( topic per table pattern).

For each CDC-enabled table, the change agent will send events to the events topic. The topic name is determined by the topicPrefix setting in the agent (default is events-). The <keyspace_name>.<table_name> is appended to the prefix to build the topic name.

```
bin/pulsar-admin source create \
--name cassandra-source-json \
--archive /home/rakulkar/C/softwares/cassandra-source-connectors-2.2.3/pulsar-cassandra-source-2.2.3.nar \
--tenant public \
--namespace default \
--destination-topic-name public/default/data-ks1.table1 \
--parallelism 1 \
--source-config '{
    "events.topic": "persistent://public/default/events-ks1.table1",
    "keyspace": "ks1",
    "table": "table1",
    "contactPoints": "localhost",
    "port": 9042,
    "loadBalancing.localDc": "datacenter1",
    "auth.provider": "PLAIN",
    "auth.username": "be_user",
    "auth.password": "BE_USER",
    "outputFormat" : "json"
}'
```

Then check your connector is in the running state with no errors:
```pulsar-admin source status --name cassandra-source-1```

#### Pulsar Messages in case of various Cassandra Events
Sample pulsar message for data insert:
key:[{"a":"TestA"}], properties:[], content:{a=TestA, b=TestB, c=TestC}

Sample pulsar message for update:
key:[{"a":"TestA"}], properties:[], content:{a=TestA, b=TestBUpdated, c=TestC}

Sample pulsar message for data deletion:
key:[{"a":"TestA"}], properties:[], content:{a=NULL, b=NULL, c=NULL}

#### Additional points to consider:
At this point, we will focus on ingest i.e. events flowing from Cassandra into BE.
Limitations:
Does not replay logged batches
Does not manage table truncates
Does not manage TTLs
Does not support range deletes
Does not sync data available before starting the CDC agent.
CQL column names must not match a Pulsar primitive type name (ex: INT32)

### References:
https://github.com/datastax/cdc-apache-cassandra
https://medium.com/building-the-open-data-stack/combine-data-at-rest-and-data-in-motion-with-cdc-for-apache-cassandra-f4e1cdf08901
 