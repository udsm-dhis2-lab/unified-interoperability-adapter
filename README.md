# Unified-Interoperability-Adapter (iAdapter)
Unified dhis2 resources adaptor for querying data from EMR or any SQL database and submitting data to DHIS2

## Features
- Support all SQL based database technologies.
- Accommodate multiple DHIS2 instances
- One DHIS2 dataset can connect to different databases i.e different dataset inputs can connect to different databases
- The iAdapter can be centralized to accommodate HF EMRs running on same network.
- Data extraction queries can easily be tested on the fly i.e as one writes the query (data correctness verification)
- Easy to set up (Docker -Minimal technical skills needed)
- Built to be set up on the premise where EMR runs

## Where iAdapter works?
Here are the components of iAdapter being positioned on interoperability infrastructure, taking an example of Tanzania in particular the UDSM DHIS2 EMR Living Lab.
  - EMR system (Databases)
  - iAdapter
  - Health Information Mediator
  - DHIS2
  
<img src="https://github.com/udsm-dhis2-lab/unified-interoperability-adapter/blob/develop/ui/src/assets/images/unified_adapter_image.png" />
