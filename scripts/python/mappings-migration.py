import requests
from requests.auth import HTTPBasicAuth
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

source_url ="https://iadapter.dhis2.udsm.ac.tz/api/v1/datastore"

async def get_mappings(namespace):
    path =source_url + "/" + namespace + "?pageSize=1000"
    print(path)
    response = requests.get(path, auth=(username,password), verify=False)
    if response.status_code == 200 or response.status_code == 201:
        return json.loads(response.content)
    else:
        return "none"
async def save_mappings_by_key(key_payload):
    response = requests.post("http://hdu-api.moh.go.tz/api/v1/datastore?update=true", 
                                    json=key_payload, auth=(username,password), 
                                    headers=headers)
    return response

async def main():
    namespaces = [
        # "MAPPINGS-NDcgQeGaJC9",
        # "MAPPINGS-v6wdME3ouXu",
        # "MAPPINGS-qpcwPcj8D6u",
        # "MAPPINGS-Pw3c2BcqbQ5",
        "MAPPINGS-cBPkl0M6T9I",
        # "MAPPINGS-V8bbSX0sFf2",
        # "MAPPINGS-RpeHQ2saIRg",
        # "MAPPINGS-cap79mdf6Co",
        # "MAPPINGS-GpPH69ru2po",
        # "MAPPINGS-GfYjZEQV98i",
        # "MAPPINGS-kSaoJVXNxZE",
        # "MAPPINGS-QntdhuQfgvT",
        # "MAPPINGS-YV5hjD0QuQG",
        # "MAPPINGS-Dy0caSoFk1Z",
        # "MAPPINGS-ExX34Bpv0qN",
        # "MAPPINGS-mU6qzGINdKw",
        # "MAPPINGS-xewWZMYbqYc",
        # "MAPPINGS-xQWse025yRw"
    ]   
    for namespace in namespaces:
        mappings = await get_mappings(namespace)
        if mappings != "none":
            print(len(mappings["results"]))
            for mapping in mappings["results"]:
                response = await save_mappings_by_key(mapping)
                print(response)
    

asyncio.run(main())