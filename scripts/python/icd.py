
import json
import asyncio
import requests
from requests.auth import HTTPBasicAuth
import os
from dotenv import load_dotenv

load_dotenv()

token_gen_headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/x-www-form-urlencoded, application/json',
    'Authorization': 'Basic ' + os.getenv('WHO_BASIC_AUTH_TOKEN')
  }

username =  os.getenv('HDU_USERNAME')
password = os.getenv('HDU_PASSWORD')
url="http://41.59.228.177"
headers = {
    'Content-Type': 'application/json; charset=utf8'
}

who_access_token =""
chapters = []
blocks = []
categories = []
codes = []
WHO_base_url ="https://id.who.int/icd"

async def create_WHO_API_token():
    response= requests.post("https://icdaccessmanagement.who.int/connect/token", headers=token_gen_headers, data='grant_type=client_credentials')
    if response.status_code == 200 or response.status_code == 201:
        return response.content
    else:
        return "none"

async def get_icd_metadata(headers, url):
    print(WHO_base_url + url)
    response = requests.get(WHO_base_url + url,headers=headers)
    if response.status_code == 200 or response.status_code == 201:
        return response.content
    else:
        return "none"

async def save_to_datastore(payload):
    response = requests.post('http://41.59.228.177/core/api/v1/datastore?update=true',
                                         data=json.dumps(payload),auth=HTTPBasicAuth("admin","AdminUser"),
                                         headers=headers)
    return response

async def main():
    response = await create_WHO_API_token()
    if response != "none":
        access_token_data = json.loads(response)
        API_auth_headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "API-Version": "v2", 
            "Accept-Language": "en",
            "Authorization": "Bearer " + access_token_data["access_token"]
        }
        # print(access_token_data)
        # Get releases
        block_references = []
        category_references= []
        code_references = []
        version="10"
        release = "2019"
        organisation = "WHO"
        release_data = await get_icd_metadata(API_auth_headers, "/release/10/2019")
        if release_data != "none":
            chapters_urls = json.loads(release_data)
            # Get chapters
            for chapter_url in chapters_urls["child"]:
                chapter_response = await get_icd_metadata(API_auth_headers, chapter_url.split("icd")[1])
                if chapter_response != "none":
                    chapter_json_data = json.loads(chapter_response)
                    chapter = {
                        "code": chapter_json_data["code"],
                        "name": chapter_json_data["code"] + "-" + chapter_json_data["title"]["@value"],
                        "version": version,
                        "release": release,
                        "organisation": organisation,
                        "url": chapter_url,
                        "title": chapter_json_data["title"]["@value"]
                    }
                    chapters.append(chapter)
                    for block_url in chapter_json_data["child"]:
                        block_references.append({
                            "blockUrl": block_url,
                            "chapter": chapter
                        })
            
            # Save chapters
            json_object = json.dumps(chapters, indent=4)
            with open("chapters.json", "w") as outfile:
                outfile.write(json_object)
            for chapter in chapters:
                payload = {
                    "namespace": "ICD-CHAPTERS",
                    "dataKey": version + "-" + chapter["code"],
                    "value": chapter
                }
                response = await save_to_datastore(payload)
                print("CHAPTER")
                print(response.status_code)
            # Load blocks
            for block_reference in block_references:
                block_response = await get_icd_metadata(API_auth_headers, block_reference["blockUrl"].split("icd")[1])
                blockCode = block_reference["blockUrl"].split("/")[len(block_reference["blockUrl"].split("/"))-1]
                if block_response != "none":
                    block_json_data = json.loads(block_response)
                    block = {
                        "code": blockCode,
                        "name": blockCode + "-" + block_json_data["title"]["@value"],
                        "version": version,
                        "release": release,
                        "organisation": organisation,
                        "url": block_reference["blockUrl"],
                        "title": block_json_data["title"]["@value"],
                        "chapter": block_reference["chapter"]
                    }
                    blocks.append(block)
                    for category_url in block_json_data["child"]:
                        category_references.append({
                            "categoryUrl": category_url,
                            "block": block
                        })
            
            json_blocks_object = json.dumps(blocks, indent=4)
            with open("blocks.json", "w") as outfile:
                outfile.write(json_blocks_object)
            # Save blocks
            for blockData in blocks:
                print(blockData)
                payload = {
                    "namespace": "ICD-BLOCKS",
                    "dataKey": version + "-" + blockData["code"],
                    "value": blockData
                }
                response = await save_to_datastore(payload)
                print("BLOCK")
                print(response.status_code)

            # Load categories
            for category_reference in category_references:
                category_response = await get_icd_metadata(API_auth_headers, category_reference["categoryUrl"].split("icd")[1])
                catgoryCode = category_reference["categoryUrl"].split("/")[len(category_reference["categoryUrl"].split("/"))-1]
                if category_response != "none":
                    category_json_data = json.loads(category_response)
                    print("################################################")
                    print(category_json_data)
                    print("################################################")
                    category = {
                        "code": catgoryCode,
                        "name": catgoryCode + "-"+ category_json_data["title"]["@value"],
                        "version": version,
                        "release": release,
                        "organisation": organisation,
                        "url": category_reference["categoryUrl"],
                        "title": category_json_data["title"]["@value"],
                        "block": category_reference["block"]
                    }
                    categories.append(category)
                    if "child" in category_json_data:
                        for code_url in category_json_data["child"]:
                            code_references.append({
                                "codeUrl": code_url,
                                "category": category
                            })
            
            json_categories_object = json.dumps(categories, indent=4)
            with open("categories.json", "w") as outfile:
                outfile.write(json_categories_object)
            json_code_references = json.dumps(code_references, indent=4)
            with open("code_references.json", "w") as outfile:
                outfile.write(json_code_references)
            # Save category
            for categoryData in categories:
                print(categoryData)
                payload = {
                    "namespace": "ICD-CATEGORIES",
                    "dataKey": version + "-" + categoryData["code"],
                    "value": categoryData
                }
                response = await save_to_datastore(payload)
                print("CATEGORY")
                print(response.status_code)

            # Load codes
            response = await create_WHO_API_token()
            if response != "none":
                access_token_data = json.loads(response)
                API_auth_headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "API-Version": "v2", 
                    "Accept-Language": "en",
                    "Authorization": "Bearer " + access_token_data["access_token"]
                }
                for code_reference in code_references:
                    code_response = await get_icd_metadata(API_auth_headers, code_reference["codeUrl"].split("icd")[1])
                    codeCode = code_reference["codeUrl"].split("/")[len(code_reference["codeUrl"].split("/"))-1]
                    if code_response != "none":
                        code_json_data = json.loads(code_response)
                        code = {
                            "code": codeCode,
                            "name": codeCode + "-" +code_json_data["title"]["@value"],
                            "version": version,
                            "release": release,
                            "organisation": organisation,
                            "url": code_reference["codeUrl"],
                            "title": code_json_data["title"]["@value"],
                            "category": code_reference["category"]
                        }
                        payload = {
                            "namespace": "ICD-CODES",
                            "dataKey": version + "-" + code["code"],
                            "value": code
                        }
                        response = await save_to_datastore(payload)
                        codes.append(code)
            
                json_codes_object = json.dumps(codes, indent=4)
                with open("codes.json", "w") as outfile:
                    outfile.write(json_codes_object)
                # # Save codes
                # for codeData in codes:
                #     print(code)
                #     payload = {
                #         "namespace": "ICD-CODES",
                #         "dataKey": version + "-" + codeData["code"],
                #         "value": codeData
                #     }
                #     response = await save_to_datastore(payload)
                #     print("CODE")
                #     print(response.status_code)
    else:
        print(response)

asyncio.run(main())