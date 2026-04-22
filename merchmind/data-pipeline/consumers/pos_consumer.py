"""
MerchMind Kafka POS Event Consumer
Processes real-time POS events → updates demand signals → triggers replenishment alerts
"""
import json
import logging
from collections import defaultdict
from datetime import datetime
from confluent_kafka import Consumer, KafkaException

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("merchmind.consumer")

KAFKA_CONF = {
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'merchmind-demand-processor',
    'auto.offset.reset': 'earliest',
    'enable.auto.commit': True,
}

# In-memory demand accumulator (replace with Redis in production)
demand_buffer: dict = defaultdict(lambda: defaultdict(int))

def process_pos_event(event: dict):
    """
    Real-time demand signal processing:
    1. Accumulate sales velocity per SKU x store
    2. Detect anomalies (sudden surge / drop)
    3. Trigger replenishment alert if stock velocity exceeds reorder threshold
    4. Push demand signal to MongoDB demand_signals collection
    """
    sku_id = event.get('skuId')
    store_id = event.get('storeId')
    quantity = event.get('quantity', 0)
    event_type = event.get('eventType', 'sale')

    if event_type == 'sale':
        demand_buffer[sku_id][store_id] += quantity
        velocity = demand_buffer[sku_id][store_id]

        # Simple threshold alert (production: ML-based anomaly detection)
        if velocity > 50:
            logger.warning(f"[ALERT] High demand surge: {sku_id} @ {store_id} = {velocity} units")
            # TODO: push alert to replenishment engine via Redis pub/sub

    elif event_type == 'return':
        demand_buffer[sku_id][store_id] = max(0, demand_buffer[sku_id][store_id] - quantity)

    logger.info(f"[POS] {event_type.upper()} — {sku_id} @ {store_id}: qty={quantity}")

def run_consumer(topic: str = 'pos-events'):
    consumer = Consumer(KAFKA_CONF)
    consumer.subscribe([topic])
    logger.info(f"[KAFKA] Consumer started — listening on '{topic}'")

    try:
        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                raise KafkaException(msg.error())
            event = json.loads(msg.value().decode('utf-8'))
            process_pos_event(event)
    except KeyboardInterrupt:
        logger.info("[KAFKA] Consumer stopped.")
    finally:
        consumer.close()

if __name__ == '__main__':
    run_consumer()
