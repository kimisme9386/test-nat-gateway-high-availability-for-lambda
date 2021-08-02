import requests
import json


def handler(event, context):
    print("Received event: " + json.dumps(event, indent=2))

    r = requests.get(
        'https://jsonplaceholder.typicode.com/todos/1'
    )
    print("Call remote api: " + r.text)
