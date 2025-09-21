from kafka import KafkaConsumer
import json

def consume_transactions():
    consumer = KafkaConsumer(
        'transactions',
        bootstrap_servers=['localhost:9092'],
        auto_offset_reset='earliest',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )

    for message in consumer:
        tx = message.value
        print(f"[Kafka Stream] New Transaction: {tx}")
        yield tx

