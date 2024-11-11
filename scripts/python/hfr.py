
import csv
import json
import requests
import asyncio
import re
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv

load_dotenv()

username =  os.getenv('HDU_USERNAME')
password = os.getenv('HDU_PASSWORD')
headers = {
    'Content-Type': 'application/json; charset=utf8'
}

hfr_path="https://him-dev.moh.go.tz:5000/get-health-facilities-from-hfr?r=api/health-facility/operating-facility"
hfr_username=os.getenv('HFR_USERNAME')
hfr_password=os.getenv('HFR_PASSWORD')

async def get_hfr_facilities(page, pageSize):
    path = hfr_path + "&page="+str(page)+"&pageSize="+str(pageSize)
    print(path)
    response = requests.get(path, verify=False)
    if response.status_code == 200 or response.status_code == 201:
        print(response.status_code)
        return response.content
    else:
        return "none"

async def add_hfr_facilities(facilities):
    for facility in facilities:
        name = re.sub(r'[^a-zA-Z0-9]', '', facility["name"])
        facility_data = {
                    "resourceType": "Organization",
                    "id": facility["facility_code"],
                    "name": name + " " +  facility["level_name"],
                    "active": True,
                    "type": [
                        "Healthcare Provider"
                    ],
                    "identifier": [
                        {
                        "use": "official",
                        "system": "hfrs.moh.go.tz",
                        "value": facility["facility_code"],
                        "type": "HFR"
                        }
                    ],
                    "description": name + " " + facility["level_name"]
                }
        print(facility_data["id"])
        response = requests.put("http://41.59.228.177/fhir/Organization/"+facility_data["id"], 
                                    json=facility_data, auth=(username,password), 
                                    headers=headers)
        print("MOH SERVER STATUS CODE: " + str(response.status_code))

        response_iadapter = requests.put("https://fhir.dhis2.udsm.ac.tz/fhir/Organization/"+facility_data["id"], 
                                    json=facility_data, auth=(username,password), 
                                    headers=headers)
        print("IADAPTER STATUS CODE: " + str(response_iadapter.status_code))

async def main():
    for i in range(1, 90):
        print(i)
        facilities = await get_hfr_facilities(i, 100)
        print(len(json.loads(facilities)["data"]))
        # print(facilities)
        if facilities != "none":
            facilities = json.loads(facilities)
            await add_hfr_facilities(facilities["data"])
        else:
            print("none")

asyncio.run(main())