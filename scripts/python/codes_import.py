import pandas as pd
import json
import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

username =  os.getenv('HDU_USERNAME')
password = os.getenv('HDU_PASSWORD')

def set_nested_value(d, key_path, value):
    """
    Sets a value in a nested dictionary given a dot-separated key path.
    Example: set_nested_value(data, "a.b.c", 10) will result in data['a']['b']['c'] = 10
    """
    keys = key_path.split('.')
    current = d
    for i, key in enumerate(keys):
        if i == len(keys) - 1:
            current[key] = value
        else:
            if key not in current:
                current[key] = {}
            elif not isinstance(current[key], dict):
                current[key] = {}
            current = current[key]

def read_and_convert_to_json(file_path):
    """
    Reads a CSV or Excel file and converts its data into a list of JSON objects
    based on a predefined structure, with dynamic handling for 'attributes'.

    For Excel files, the sheet name is used as the 'namespace'.
    For CSV files, the filename (without extension) is used as the 'namespace'.

    Args:
        file_path (str): The path to the CSV or Excel file.

    Returns:
        list: A list of dictionaries, where each dictionary represents a JSON object
              derived from a row in the input file. Returns an empty list if the
              file cannot be read, is empty, or has an unsupported format.
    """
    all_json_data = []
    file_extension = os.path.splitext(file_path)[1].lower()

    index = 0

    try:
        if file_extension == '.csv':
            df = pd.read_csv(file_path)
            namespace_value = os.path.splitext(os.path.basename(file_path))[0]

            for index, row in df.iterrows():
                if is_row_effectively_empty(row):
                    emptyConsecutiveRows += 1
                    continue
                else:
                    emptyConsecutiveRows = 0

                if emptyConsecutiveRows >= 3:
                    break

                index = index
                json_obj = create_json_from_row(row, namespace_value)
                print("\n =================================================================================================================================== =====================================================\n ")
                print("Send data row number ", index, " to DataStore for sheet ", "with request ", json_obj," \n")
                try:
                    response = sendToDataStore(json_obj)
                    print("Sent data row number ", index, " to DataStore for sheet ", namespace_value, ' with response ', response.json())
                    all_json_data.append(json_obj)
                except Exception as e:
                    print("Failed to send data row number ", index, " to DataStore for sheet ", namespace_value, " with error: ", e)
                all_json_data.append(json_obj)

        elif file_extension == '.xlsx':
            xls = pd.ExcelFile(file_path)
            emptyConsecutiveRows = 0
            for sheet_name in xls.sheet_names:
                df = xls.parse(sheet_name)
                namespace_value = sheet_name


                for index, row in df.iterrows():
                    if is_row_effectively_empty(row):
                        emptyConsecutiveRows += 1
                        continue
                    else:
                        emptyConsecutiveRows = 0

                    if emptyConsecutiveRows >= 3:
                        break

                    index = index
                    json_obj = create_json_from_row(row, namespace_value)
                    print("\n =================================================================================================================================== =====================================================\n ")
                    print("Send data row number ", index, " to DataStore for sheet ", "with request ", json_obj," \n")
                    try:
                        response = sendToDataStore(json_obj)
                        print("Sent data row number ", index, " to DataStore for sheet ", namespace_value, ' with response ', response.json())
                        all_json_data.append(json_obj)
                    except Exception as e:
                        print("Failed to send data row number ", index, " to DataStore for sheet ", namespace_value, " with error: ", e)
                    all_json_data.append(json_obj)

                print("Finished sheet ", namespace_value, "===================================================================================================================================================================================================\n")
        else:
            print(f"Unsupported file type: {file_extension}. Please provide a .csv or .xlsx file.")
            return []

    except FileNotFoundError:
        print(f"Error: The file '{file_path}' was not found.")
        return []
    except pd.errors.EmptyDataError:
        print(f"Error: The file '{file_path}' is empty.")
        return []
    except Exception as e:
        print(f"An unexpected error occurred while processing '{file_path}': {e}")
        return []

    return all_json_data


def is_row_effectively_empty(row_series):
    """
    Checks if a pandas Series (representing a row) contains no meaningful data.
    Considers NaN, None, empty strings, and whitespace-only strings as "empty".
    """
    if row_series.empty:
        return True
    if row_series.isnull().all():
        return True

    for value in row_series:
        if pd.notna(value):
            if isinstance(value, str):
                if value.strip() != "":
                    return False
            else:
                return False 
    return True


def sendToDataStore(json_data):
    url = "http://41.59.228.177/api/v1/datastore?update=true"
    headers = {
        'Content-type': 'application/json',
    }
    response = requests.post(f"{url}", json=json_data, auth=HTTPBasicAuth(username,password), headers=headers)

    return response


def create_json_from_row(row_data, namespace_value):
    """
    Constructs a single JSON object from a pandas DataFrame row based on the
    specified nested structure, with dynamic handling for 'attributes'.
    """
    def get_val(col_name, default=""):
        val = row_data.get(col_name)
        return val if pd.notna(val) else default

    dynamic_attributes = {}
    ATTRIBUTES_PREFIX = "value.attributes."

    for col_name in row_data.index:
        if col_name.startswith(ATTRIBUTES_PREFIX):
            attribute_key_path = col_name[len(ATTRIBUTES_PREFIX):]
            attribute_value = get_val(col_name)
            
            set_nested_value(dynamic_attributes, attribute_key_path, attribute_value)

    json_object = {
        "namespace": namespace_value,
        "dataKey": get_val("dataKey"),
        "description": get_val("description"),
        "datastoreGroup": "GENERAL-CODES" if  namespace_value.lower().find('loinc') == -1 and namespace_value.lower().find('snomed') == -1 else get_val("datastoreGroup"),
        "value": {
            "code": get_val("value.code"),
            "name": get_val("value.name"),
            "version": get_val("value.version", "1.0.0"),
            "release": get_val("value.release"),
            "url": get_val("value.url"),
            "organisation": get_val("value.organisation", "MOH"),
            "attributes": dynamic_attributes
        }
    }
    return json_object



filePath = "references/codes_import.xlsx"

read_and_convert_to_json(filePath)