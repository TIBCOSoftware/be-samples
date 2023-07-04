package com.tibco.mqtt.samples;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.util.HashMap;
import java.util.Map;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;

public class TemperaturePublisher {
	
	public static void main(String[] args) {
		
		try{
			
			if( (args.length!=0 && args[0]!=null && !args[0].equals("")) && ( (args[0].equals("firstfloor")) || (args[0].equals("secondfloor")) )){
				
				String floor = args[0];
				String topic = "/building/" + floor ;
				String uri = "tcp://localhost:1883";
				
				if(args.length>1 && !args[1].equals("")){
					uri = args[1];
				}
				
				MqttClient client = new MqttClient(uri, MqttClient.generateClientId());
				MqttConnectOptions connOpt = new MqttConnectOptions();
				client.connect(connOpt);
				
				Map map = new HashMap();
				map.put("temperature", 22);
				
				publish(client, topic, serializeMap(map));
				
				System.out.println("Published");
				
				client.disconnect();
				System.exit(0);
				
			}else{
				throw new Exception("Invalid argument");
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
	}
	
	static private void publish(MqttClient client, String topic, byte[] temperature) throws MqttPersistenceException, MqttException {
		
		MqttMessage message = new MqttMessage();
		message.setPayload(temperature);
		client.publish(topic, message);
	}
	
	static private byte[] serializeMap(Map map) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ObjectOutputStream oos = new ObjectOutputStream(baos);
		try{
			oos.writeObject(map);
		}
		finally{
			oos.close();
			return baos.toByteArray();
		}
	}
}
