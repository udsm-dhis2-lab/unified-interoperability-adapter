
import csv
import json
import requests
from requests.auth import HTTPBasicAuth
username = 'admin'
password = 'AdminUser'
headers = {
    'Content-Type': 'application/json; charset=utf8'
}

files_refeerences = ["Consultation_general_services.csv",
                     "Laboratory_services.csv",
                     "Radiology_services.csv",
                     "Anesthesia.csv",
                     "Cardiology_services.csv",
                     "Medical_services.csv",
                     "Neurosurgical.csv",
                     "Occupational_therapy.csv",
                     "Prosthetics.csv"]

# files_refeerences = ["Psychiatry.csv",
#                      "Speech_and_Language.csv",
#                      "Surgical_services.csv"]
for name in files_refeerences:
    with open('references/'+name, mode='r') as file:
        # Create a CSV reader object
        csv_reader = csv.reader(file)
        # Iterate over each row in the CSV file
        for row in csv_reader:
            if (row[0] !="CODE"):
                department = ""
                if len(row)> 3:
                    department = row[3]
                datastore_data = {
                    "namespace": "billings",
                    "dataKey": row[0],
                    "value": {
                        "code": row[0],
                        "name": row[1],
                        "category": row[2],
                        "department": department
                    }
                }
                response = requests.post('http://41.59.228.177/core/api/v1/datastore?update=true', 
                                        json=datastore_data, auth=HTTPBasicAuth(username,password), 
                                        headers=headers)
                print(row[2])
                print("status code")
                print(response.status_code)
            else:
                print("NOT VALID")