import requests
import asyncio
import os
from dotenv import load_dotenv
import json

load_dotenv()

username =  os.getenv('HDU_USERNAME')
password = os.getenv('HDU_PASSWORD')

headers = {
    'Content-Type': 'application/json; charset=utf8'
}

source_url ="https://iadapter.dhis2.udsm.ac.tz/api/v1/hduApi/configurations"
async def get_conigurations():
    path =source_url + "?page=1&pageSize=100"
    print(path)
    response = requests.get(path, auth=(username,password), verify=False)
    if response.status_code == 200 or response.status_code == 201:
        payload = json.loads(response.content)
        return payload
    else:
        return "none"
    
async def save_conifguration(payload):
    payload['value'] = {
    'key': payload.get('key'),
    'code': payload.get('key'),
    'name': payload.get('name'),
    'keyToUseInMappings': payload.get('keyToUseInMappings'),
    'options': payload.get('options'),
}
    payload.pop('uuid', None)
    payload.pop('code', None)
    payload.pop('name', None)
    payload.pop('keyToUseInMappings', None)
    payload.pop('options', None)
    print(payload)
    response = requests.post("http://hdu-api.moh.go.tz/api/v1/hduApi/configurations", 
                                    json=payload, auth=(username,password), 
                                    headers=headers)
    return response

async def main():
    configurations = await get_conigurations()
    if configurations != "none":
        print(len(configurations["results"]))
        for configuration in configurations["results"]:
            response = await save_conifguration(configuration)
            print(response)
    

asyncio.run(main())