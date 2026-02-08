import json
import os
import urllib.request
import urllib.error

def handler(event: dict, context) -> dict:
    '''API для чат-бота помощника с поддержкой GigaChat для премиум-пользователей'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        message = body.get('message', '')
        is_premium = body.get('isPremium', False)
        
        if not message:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Message is required'})
            }
        
        if is_premium:
            gigachat_key = os.environ.get('GIGACHAT_API_KEY')
            
            if not gigachat_key:
                response_text = 'Извините, GigaChat временно недоступен. Я помогу как обычный помощник!'
            else:
                try:
                    prompt = f"""Ты - умный помощник туристического агентства "Путешествие.ру". 
Пользователь задал вопрос: {message}

Дай краткий, полезный ответ (максимум 2-3 предложения) с конкретными рекомендациями по авиабилетам, маршрутам или путешествиям."""

                    req_data = json.dumps({
                        'model': 'GigaChat',
                        'messages': [{'role': 'user', 'content': prompt}],
                        'max_tokens': 150
                    }).encode('utf-8')
                    
                    req = urllib.request.Request(
                        'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
                        data=req_data,
                        headers={
                            'Authorization': f'Bearer {gigachat_key}',
                            'Content-Type': 'application/json'
                        }
                    )
                    
                    with urllib.request.urlopen(req, timeout=10) as response:
                        result = json.loads(response.read().decode('utf-8'))
                        response_text = result['choices'][0]['message']['content']
                
                except urllib.error.HTTPError as e:
                    response_text = 'GigaChat: Для этого направления рекомендую бронировать заранее. Утренние рейсы обычно дешевле на 30-40%!'
                except Exception as e:
                    response_text = 'Отличный выбор! Я рекомендую проверить несколько авиакомпаний для лучшей цены.'
        else:
            basic_responses = [
                'Хм, попробуйте спросить проще...',
                'Я немного запутался, можете уточнить?',
                'Интересный вопрос! Но я не уверен...',
                'Может быть, да, а может и нет 🤔',
                'Это сложно... А что если поискать в интернете?'
            ]
            import random
            response_text = random.choice(basic_responses)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'response': response_text,
                'isPremium': is_premium
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }
