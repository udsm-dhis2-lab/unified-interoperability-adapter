import json
import asyncio
import csv
import requests
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv

load_dotenv()

username = os.getenv('HDU_USERNAME')
password = os.getenv('HDU_PASSWORD')

url="http://41.59.228.177/core"
headers = {
    'Content-Type': 'application/json; charset=utf8'
}

async def save_codes():
    codes = []
    with open('references/ICD_10_codes.csv', mode='r') as file:
        # Create a CSV reader object
        csv_reader = csv.reader(file)
        # Iterate over each row in the CSV file
        for row in csv_reader:
            code = {
                "namespace": "ICD-CODES",
                "dataKey": "10-" + row[5].strip(),
                "value": {
                    "code": row[5].strip(),
                    "name": row[3],
                    "release": "2019",
                    "version": "10",
                    "organisation": "WHO",
                    "url": "http://id.who.int/icd/release/10/2019/" + row[5].strip()
                }
            }
            print(code)
            codes.append(code)
            response = requests.post('http://41.59.228.177/core/api/v1/datastore?update=true', 
                                        json=code, auth=(username,password), 
                                        headers=headers)
            print(response.status_code)
    return codes

async def main():
    codes = await save_codes()
        
asyncio.run(main())