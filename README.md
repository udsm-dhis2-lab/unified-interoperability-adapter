# Unified-Interoperability-Adapter (iAdapter)
Unified DHIS2 resources adaptor for querying data from EMR or any SQL database and submitting data to DHIS2

## Getting started
- The code base has frontend and backend codes together.
- The frontend is developed using Angular 14
- Backend is develped using Java

## Installation
To install the iAdapter you need to following 3 good steps
- Install ```docker``` from ```https://docs.docker.com/get-docker/```
- Add docker file shared on the folder you want the iAdapter to be situated
- Within docker file directory, open terminal add run
  - ```docker compose pull```
  - ```docker compose up -d```

## Prerequisites
 - Mapping of ICD 10/11 diseases into disease diagnosis as per country's HMIS aggregate reporting tools
    - The mapping should be carried out by medical practitioner with knowledge about ICD 10/11 classifications

## Features
- Directly map the DHIS2 data elements & categorycombos to data extraction queries
- Support all SQL based database technologies.
- Accommodate multiple DHIS2 instances
- One DHIS2 dataset can connect to different databases i.e different dataset inputs can connect to different databases
- The iAdapter can be centralized to accommodate HF EMRs running on same network.
- Data extraction queries can easily be tested on the fly i.e as one writes the query (data correctness verification)
- Easy to set up (Docker -Minimal technical skills needed)
- Built to be set up on the premise where EMR runs

## How does the iAdapter work?
Here are the components of iAdapter being positioned on interoperability infrastructure, taking an example of Tanzania in particular the University of Dar es Salaaam Health Centre Living Lab.
  - EMR system (Databases)
  - iAdapter
  - Health Information Mediator
  - DHIS2
  
<img src="https://github.com/udsm-dhis2-lab/unified-interoperability-adapter/blob/develop/ui/src/assets/images/unified_adapter_image.png" />
