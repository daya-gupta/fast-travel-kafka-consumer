# fast-travel-kafka-consumer
Kafka consumer for fast travel

## Run Locally

Clone the project

```bash
  git clone https://github.com/daya-gupta/fast-travel-kafka-consumer.git
```

Go to the project directory

Install dependencies

```bash
  npm install
```

Go to kakfa_deployment
```bash
  cd .\kafka_deployment
```

Run docker compose
```bash
  docker-compose -f .\kafka_zookeeper.yaml up -d
```

Goto kafka and Run command
```bash
	docker exec -it kafka1 /bin/sh
	kafka-topics --boostrap-server localhost:9092 --create --topics expired_bookings
```

Start the server in production mode

```bash
  npm run start
```

Start the server in development mode

```bash
  npm run dev
```

## Delete kafka delployment

Go to kakfa_deployment
```bash
  cd .\kafka_deployment
```

Run docker compose
```bash
  docker-compose -f .\kafka_zookeeper.yaml down
```
