import json
import os
from urllib.parse import urlencode
import urllib.request

def handler(event: dict, context) -> dict:
    '''API для авторизации через Яндекс ID'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    client_id = os.environ.get('YANDEX_CLIENT_ID')
    client_secret = os.environ.get('YANDEX_CLIENT_SECRET')
    
    if not client_id or not client_secret:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Yandex OAuth credentials not configured'})
        }
    
    query_params = event.get('queryStringParameters', {})
    
    if method == 'GET' and 'code' not in query_params:
        redirect_uri = query_params.get('redirect_uri', 'http://localhost:5173/profile')
        auth_url = 'https://oauth.yandex.ru/authorize?' + urlencode({
            'response_type': 'code',
            'client_id': client_id,
            'redirect_uri': redirect_uri
        })
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'auth_url': auth_url})
        }
    
    if method == 'GET' and 'code' in query_params:
        code = query_params['code']
        redirect_uri = query_params.get('redirect_uri', 'http://localhost:5173/profile')
        
        token_data = urlencode({
            'grant_type': 'authorization_code',
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret
        }).encode('utf-8')
        
        try:
            req = urllib.request.Request(
                'https://oauth.yandex.ru/token',
                data=token_data,
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            with urllib.request.urlopen(req) as response:
                token_response = json.loads(response.read().decode('utf-8'))
            
            access_token = token_response.get('access_token')
            
            user_req = urllib.request.Request(
                'https://login.yandex.ru/info',
                headers={'Authorization': f'OAuth {access_token}'}
            )
            with urllib.request.urlopen(user_req) as user_response:
                user_info = json.loads(user_response.read().decode('utf-8'))
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'access_token': access_token,
                    'user': {
                        'id': user_info.get('id'),
                        'login': user_info.get('login'),
                        'display_name': user_info.get('display_name'),
                        'real_name': user_info.get('real_name'),
                        'avatar_id': user_info.get('default_avatar_id')
                    }
                })
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': f'OAuth error: {str(e)}'})
            }
    
    return {
        'statusCode': 400,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Invalid request'})
    }
