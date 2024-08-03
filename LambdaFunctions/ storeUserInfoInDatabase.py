import json
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
  # Extract user attributes from the event
  user_attributes = event['request']['userAttributes']
  
  # Prepare item to be inserted into DynamoDB
  item = {
    'user_id': user_attributes['sub'],
    'email': user_attributes['email'],
    'firstName': user_attributes.get('given_name', ''),
    'lastName': user_attributes.get('family_name', ''),
    'createdAt': datetime.utcnow().isoformat()
  }
  
  # Insert item into DynamoDB
  try:
    table.put_item(Item=item)
    print('User data inserted successfully')
  except Exception as e:
    print(f'Error inserting user data: {e}')
  
  # Return event back to Cognito
  return event
