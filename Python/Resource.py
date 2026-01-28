# Python Example: Reading Entities
# Filterable fields: garden, city, title, content, visibility, category
import requests

def make_api_request(api_path, method='GET', data=None):
    url = f'https://app.base44.com/api/{api_path}'
    headers = {
        'api_key': '67842a749e4b495ea15bbb07ee621eec',
        'Content-Type': 'application/json'
    }
    if method.upper() == 'GET':
        response = requests.request(method, url, headers=headers, params=data)
    else:
        response = requests.request(method, url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()

entities = make_api_request(f'apps/6978d279311c338a4846cd15/entities/Resource')
print(entities)

# Python Example: Updating an Entity
# Filterable fields: garden, city, title, content, visibility, category
def update_entity(entity_id, update_data):
    response = requests.put(
        f'https://app.base44.com/api/apps/6978d279311c338a4846cd15/entities/Resource/{entity_id}',
        headers={
            'api_key': '67842a749e4b495ea15bbb07ee621eec',
            'Content-Type': 'application/json'
        },
        json=update_data
    )
    response.raise_for_status()
    return response.json()