import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Чати — ИИ-помощник сервиса Путешествие.ру. Отвечает на вопросы пользователей с помощью OpenAI."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    cors = {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': cors, 'body': json.dumps({'error': 'Method not allowed'})}

    body = json.loads(event.get('body', '{}'))
    user_message = body.get('message', '').strip()
    is_premium = body.get('isPremium', False)
    history = body.get('history', [])

    if not user_message:
        return {'statusCode': 400, 'headers': cors, 'body': json.dumps({'error': 'Empty message'})}

    api_key = os.environ.get('OPENAI_API_KEY', '')
    if not api_key:
        return {
            'statusCode': 200,
            'headers': cors,
            'body': json.dumps({
                'response': '⚠️ Сейчас ведутся технические работы на серверах. ИИ-модуль временно недоступен. Попробуйте позже!'
            })
        }

    system_prompt = """Ты — Чати, дружелюбный ИИ-помощник сервиса Путешествие.ру.

ТЕКУЩАЯ СИТУАЦИЯ: На сервисе ведутся технические работы из-за повреждения серверов. Поиск и бронирование билетов временно недоступны.

Твои задачи:
- Отвечать на вопросы о путешествиях, городах России, достопримечательностях
- Давать советы по планированию поездок
- Помогать с выбором направлений
- Если спрашивают о бронировании — вежливо сообщать, что сейчас тех. работы и нужно попробовать позже
- Отвечать кратко (2-4 предложения), по-русски, дружелюбно
- Не придумывать конкретные цены на билеты"""

    if is_premium:
        system_prompt += "\n- Пользователь имеет Premium-статус. Обращайся уважительно и предлагай эксклюзивные рекомендации."

    messages = [{"role": "system", "content": system_prompt}]

    for h in history[-6:]:
        role = h.get('role', 'user')
        if role in ('user', 'assistant'):
            messages.append({"role": role, "content": h.get('content', '')})

    messages.append({"role": "user", "content": user_message})

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": messages,
        "max_tokens": 300,
        "temperature": 0.7
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {api_key}'
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            answer = data['choices'][0]['message']['content']
    except urllib.error.HTTPError:
        answer = '⚠️ Серверы перегружены из-за технических работ. Попробуйте через пару минут!'
    except Exception:
        answer = '⚠️ Не удалось получить ответ. Ведутся технические работы — попробуйте позже.'

    return {
        'statusCode': 200,
        'headers': cors,
        'body': json.dumps({'response': answer})
    }
