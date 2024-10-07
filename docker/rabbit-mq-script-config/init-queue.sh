#!/bin/bash

# Wait for RabbitMQ server to start
sleep 10

# Login as the default user
rabbitmqctl add_user notification_service_api_mq notification_service_api_mq
rabbitmqctl set_user_tags notification_service_api_mq administrator
rabbitmqctl set_permissions -p / notification_service_api_mq ".*" ".*" ".*"

# Declare the queue
rabbitmqadmin -u notification_service_api_mq -p notification_service_api_mq declare queue name=notification-service durable=true
