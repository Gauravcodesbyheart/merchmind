"""
MerchMind Kafka POS Event Producer
Simulates real-time POS data streaming from 142 stores
"""
import asyncio
import json
import random
from datetime import datetime
from confluent_kafka import Producer

KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': 'merchmind-pos-producer',
}

SKUS = ['SKU-1023', 'SKU-0774', 'SKU-2201', 'SKU-3340', 'SKU-0551',
        'SKU-4412', 'SKU-5501', 'SKU-6678', 'SKU-902', 'SKU-781']

def delivery_report(err, msg):
    if err:
        print(f'[KAFKA] Delivery failed: {err}')

def generate_pos_event(store_id: int) -> dict:
    return {
        'eventId': f'POS-{random.randint(100000, 999999)}',
        'timestamp': datetime.utcnow().isoformat(),
        'storeId': f'store_{store_id:02d}',
        'skuId': random.choice(SKUS),
        'quantity': random.randint(1, 5),
        'unitPrice': round(random.uniform(299, 9999), 2),
        'discountPct': random.choice([0, 0, 0, 10, 15, 20]),
        'channel': random.choice(['physical', 'online', 'app']),
        'eventType': random.choices(['sale', 'return'], weights=[9, 1])[0],
        'weatherCode': random.choice(['sunny', 'rainy', 'cloudy']),
    }

def run_producer(events_per_second: int = 10, duration_seconds: int = 60):
    producer = Producer(KAFKA_CONF)
    total_events = 0
    end_time = datetime.utcnow().timestamp() + duration_seconds

    print(f'[KAFKA] POS Producer started — {events_per_second} events/sec for {duration_seconds}s')

    while datetime.utcnow().timestamp() < end_time:
        for _ in range(events_per_second):
            store_id = random.randint(1, 50)
            event = generate_pos_event(store_id)
            producer.produce(
                topic='pos-events',
                key=event['storeId'],
                value=json.dumps(event).encode('utf-8'),
                callback=delivery_report,
            )
            total_events += 1
        producer.poll(0)
        import time; time.sleep(1)

    producer.flush()
    print(f'[KAFKA] Done. Produced {total_events} events.')

if __name__ == '__main__':
    run_producer(events_per_second=20, duration_seconds=300)
