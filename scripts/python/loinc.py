
import csv
import json
import requests
from requests.auth import HTTPBasicAuth
import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

username =  os.getenv('HDU_USERNAME')
password = os.getenv('HDU_PASSWORD')

headers = {
    'Content-Type': 'application/json; charset=utf8'
}

reference_class_types = [
    {
        'class': 'UA',
        'name': 'Urinalysis'
    },{
        'class': 'COAG',
        'name': 'Coagulation'
    },{
        'class': 'MOLPATH',
        'name': 'Molecular Pathology'
    },{
        'class': 'CELLMARK',
        'name': 'Cell Markers'
    },{
        'class': 'CYTO',
        'name': 'Cytology'
    },{
        'class': 'BLOOD BANK',
        'name': 'Blood Bank'
    },{
        'class': 'PARASITOLOGY',
        'name': 'Parasitology'
    },{
        'class': 'PATH',
        'name': 'Pathology'
    },{
        'class': 'MYCOLOGY',
        'name': 'Mycology'
    },{
        'class': 'VIROLOGY',
        'name': 'Virology'
    },{
        'class': 'IMMUNOHISTO',
        'name': 'Immunohistochemistry'
    },
    {
        'class': 'CHEM',
        'name': 'Chemistry'
    },
    {
        "class": "PANEL.CHEM",
        "name": "Chemistry"
    },
    {
        'class': 'HEM/BC',
        'name': 'Hematology and Blood Cell Counts'
    },
    {
        'class': 'MICRO',
        'name': 'Microbiology'
    },
    {
        'class': 'SERO',
        'name': 'Serology'
    },
    {
        'class': 'TOX',
        'name': 'Toxicology'
    },
]

keyed_references = {}
for class_type in reference_class_types:
    keyed_references[class_type['class']] = class_type

async def process_loinc_code():
    with open('references/Loinc.csv', mode='r') as file:
        # Create a CSV reader object
        csv_reader = csv.reader(file)
        # Iterate over each row in the CSV file
        for row in csv_reader:
            if (row[7] in keyed_references):
                print("FOUND")
                associatedObservations = []
                if row[36]:
                    if len(row[36].split(";"))> 0:
                        for code in row[36].split(";"):
                            associatedObservations.append({
                                "code": code
                            })
                        
                datastore_data = {
                    "namespace": "LOINC",
                    "dataKey": "2-" + row[0],
                    "value": {
                        "code": row[0],
                        "name": row[0] +" " + row[1],
                        "longCommonName": row[25],
                        "displayName": row[39],
                        "system": row[4],
                        "majorVersion": "2",
                        "version": row[8],
                        "release": "2024",
                        "class": row[7],
                        "chapter": "lab",
                        "department": "",
                        "specimenSource": "",
                        "formula": row[14],
                        "panelType": row[34],
                        "status": row[11],
                        "orderObs": row[21],
                        "definitionDescription": row[10],
                        "exampleUnits": row[24],
                        "associatedObservations": associatedObservations
                    }
                }
                response = requests.post('http://41.59.228.177/core/api/v1/datastore?update=true', 
                                        json=datastore_data, auth=HTTPBasicAuth(username,password), 
                                        headers=headers)
                print("status code")
                print(response.status_code)
            else:
                print("NOT FOUND")
    return "DONE"

async def main():
    response = await process_loinc_code()

asyncio.run(main())