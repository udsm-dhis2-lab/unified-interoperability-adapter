// This is a simple example of a FSH file.
// This file can be renamed, and additional FSH files can be added.
// SUSHI will look for definitions in any file using the .fsh ending.
Profile: HDUAPIClient
Parent: Patient
Description: "HDU API Client Patient resource."
* name 1..* MS

Instance: Patient
InstanceOf: HDUAPIClient
Description: "HDU API Client demographics"
* name
  * given[0] = "HDU"
  * family = "API"