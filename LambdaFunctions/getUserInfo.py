import json
import boto3
from boto3.dynamodb.conditions import Attr

# Initialize a DynamoDB client
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

def lambda_handler(event, context):
    # Extract email from the query string parameters
    email = event.get("queryStringParameters", {}).get("email")
    
    if not email:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Email is required'})
        }
    
    try:
        # Scan the table using a filter expression
        response = table.scan(
            FilterExpression=Attr('email').eq(email),
            ProjectionExpression='firstName, lastName'
        )
        
        items = response.get('Items', [])
        
        # Check if the user was found
        if items:
            user = items[0]
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({
                    'firstName': user.get('firstName'),
                    'lastName': user.get('lastName')
                })
            }
        else:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json'
                },
                'body': json.dumps({'message': 'User not found'})
            }
    
    except Exception as e:
        print(f"Error getting user info: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'message': 'Internal server error'})
        }
