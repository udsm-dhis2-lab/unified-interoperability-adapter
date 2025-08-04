import pandas as pd
import json
import re
import os
import requests
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

username = os.getenv('HDU_USERNAME')
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

def build_relationships_array(row_data):
    """
    Parses columns with bracket notation (e.g., 'value.relationships[0].type')
    to build a proper list of relationship objects.
    """
    relationships_data = {}
    REL_PREFIX = 'value.relationships['
    
    for col_name, value in row_data.items():
        if col_name.startswith(REL_PREFIX) and pd.notna(value):
            path = col_name[len(REL_PREFIX):]
            match = re.match(r'(\d+)\]\.(.*)', path)
            if match:
                index = int(match.group(1))
                key_path = match.group(2)
                
                if index not in relationships_data:
                    relationships_data[index] = {}
                relationships_data[index][key_path] = value

    final_relationships = []
    for index in sorted(relationships_data.keys()):
        rel_cols = relationships_data[index]
        
        relationship_obj = {
            "type": rel_cols.get("type", ""),
            "codes": []
        }
        
        codes_data = {}
        CODES_PREFIX = 'codes['
        for key, val in rel_cols.items():
            if key.startswith(CODES_PREFIX):
                code_path = key[len(CODES_PREFIX):]
                code_match = re.match(r'(\d+)\]\.(.*)', code_path)
                if code_match:
                    code_index = int(code_match.group(1))
                    code_key = code_match.group(2)
                    
                    if code_index not in codes_data:
                        codes_data[code_index] = {}
                    codes_data[code_index][code_key] = val
                    
        for code_index in sorted(codes_data.keys()):
            code_obj = {
                "code": codes_data[code_index].get("code", ""),
                "name": codes_data[code_index].get("name", ""),
                "codeType": codes_data[code_index].get("codeType", "")
            }
            relationship_obj["codes"].append(code_obj)
            
        final_relationships.append(relationship_obj)
        
    return final_relationships

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
            # print(xls.sheet_names)
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
    url = "http://hdu-api-dev.moh.go.tz/api/v1/datastore?update=true"
    # url = "http://localhost:8091/api/v1/datastore?update=true"
    headers = {
        'Content-type': 'application/json',
    }
    response = requests.post(f"{url}", json=json_data, headers=headers, auth=HTTPBasicAuth(username, password))

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

    relationships_array = build_relationships_array(row_data)

    orgName = get_val("value.organisation", "MOH")

    json_object = {
        "namespace": namespace_value,
        "dataKey": get_val("dataKey"),
        "description": get_val("description"),
        "datastoreGroup": "GENERAL-CODES" if  orgName == "MOH" else "STANDARD-CODES",
        "value": {
            "codeType": namespace_value,
            "code": get_val("value.code"),
            "name": get_val("value.name"),
            "shortName": get_val("value.shortName"),
            "version": get_val("value.version"),
            "release": get_val("value.release"),
            "url": get_val("value.url"),
            "organisation": orgName,
            "relationships": relationships_array,
            "attributes": dynamic_attributes
        }
    }
    return json_object



filePath = "references/sample-new-format.xlsx"

read_and_convert_to_json(filePath)