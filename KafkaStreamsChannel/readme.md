# Purpose of This Example

The KafkaStreamsChannel example demonstrates how TIBCO BusinessEvents&reg; can be configured to use Apache Kafka Streams to process and analyze data stored in Kafka topics. You can examine the project in TIBCO BusinessEvents Studio to understand the setup, and refer to TIBCO BusinessEvents Developer's Guide for details on channel configuration.

## About the project

The project has 2 inference agent classes - a producer agent that creates and sends Order and Inventory events and a streams agent that uses Kafka Stream to process records from Kafka topic and then serialize the output to events.

The producer agent leverages Kafka channel to send message to Kafka topics. The Order Events are created and send to a Kafka destination every 10 seconds. The Inventory event is create and send to another Kafka destination every 30 seconds. The inventory snapshot for a session is stored using a Scorecard.

The streams agent includes 2 Kafka Streams destinations in agent's input destination config. A Kafka Streams processor topology is configured on each destination to process order records using various transformations. The processor topology on each destination is explained below.

### OrderStream destination
The records on Kafka topic are transformed by the processor topology and finally an event is created using KafkaJsonSerialier. The KafkaJsonSerializer decodes the record's value as JSON string and deserializes it to create ItemDemand event. The processor topology configured on OrderStream destination perform transformations in following order.


- FlatMap - Flattens out the Order into multiple records per line item.</li>
- SelectKey - Selects item name as record key.</li>
- GroupByKey - Groups the stream by record key i.e. item name.</li>
- Aggregate - Aggregates the records grouped by key to calculate total demand quantity form an item by adding quantity ordered per line item.</li>
- ToStream - Converts the result of aggregate to a stream for further transformations.</li>
- Join - Performs a key join with records from Inventory stream. The output of join provides a consolidated item record with the demand quantity and the quantity available to ship inventory.</li>

The ItemDemand event triggers a rule and when demand quantity exceeds quantity available to ship, its action is executed to send a ReplenishInventory event.

### CustomerOrderCount destination
The records on Kafka topic are transformed by the processor topology and finally an event is created using KeyValueSerialier. The KeyValueSerialier decodes the record's key and value as primitive types and deserializes it to create CustomerOrderCount event. The processor topology configured on CustomerOrderCount destination perform transformations in following order.</p>

- SelectKey - Selects customer id as record key.
- GroupByKey - Groups the stream by record key i.e. item name.
- Count - Aggregates the records grouped by key to count the orders by customer id.

The CustomerOrderCount event triggers a rule, that simply print the customer id and order count to console.
