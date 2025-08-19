This project implements Jira Ticket [INJIMOB-3320](https://mosip.atlassian.net/browse/INJIMOB-3320)

### Overview
A common Spring Boot service that can dynamically accept, validate, store, and retrieve JSON (Map<String, Object>) payloads so that all use-cases can reuse the same service and store dynamic data structures in a PostgreSQL DB with validation and flexible schema mapping.

## Running the application locally
1. Pull the repository locally to your system
2. Run the command `docker-compose up` to start the databases
3. Run the command `./mvwn spring-boot:run` to start the application

## Project Structure

```
ProjectDir
├── docker-compose.yml
├── HELP.md
├── init
│   ├── 1-init.sql
│   ├── 2-certify-schema.sql
│   └── 3-farmer-schema.sql
├── mvnw
├── mvnw.cmd
├── pom.xml
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── mosip
│   │   │           └── inji_usecase
│   │   │               ├── InjiApplication.java
│   │   │               ├── config
│   │   │               │   ├── CertifyConfiguration.java
│   │   │               │   └── FarmerConfiguration.java
│   │   │               ├── controller
│   │   │               │   └── DataController.java
│   │   │               ├── dto
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyDto.java
│   │   │               │   └── farmer
│   │   │               │       └── FarmerDto.java
│   │   │               ├── entity
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyEntity.java
│   │   │               │   └── farmer
│   │   │               │       └── FarmerEntity.java
│   │   │               ├── mapper
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyMapper.java
│   │   │               │   ├── farmer
│   │   │               │   │   └── FarmerMapper.java
│   │   │               │   └── MappingUtils.java
│   │   │               ├── repository
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyRepository.java
│   │   │               │   └── farmer
│   │   │               │       └── FarmerRepository.java
│   │   │               └── service
│   │   │                   ├── query
│   │   │                   │   ├── CriteriaSpecification.java
│   │   │                   │   ├── SearchCriteria.java
│   │   │                   │   ├── SearchDto.java
│   │   │                   │   ├── SearchOperation.java
│   │   │                   │   └── SpecificationBuilder.java
│   │   │                   ├── repository
│   │   │                   │   ├── CertifyRepositoryService.java
│   │   │                   │   ├── FarmerRepositoryService.java
│   │   │                   │   └── RepositoryService.java
│   │   │                   └── validation
│   │   │                       ├── CertifyValidationService.java
│   │   │                       ├── FarmerValidationService.java
│   │   │                       ├── ValidationService.java
│   │   │                       ├── ValidationType.java
│   │   │                       └── VerifyFieldService.java
│   │   └── resources
│   │       ├── application.properties
│   │       ├── database.properties
│   │       ├── static
│   │       ├── templates
│   │       └── validation
│   │           ├── certify.json
│   │           └── farmer.json
```
The project mostly follows Java Spring Boot structure.
The implementation for GET /api/data/query is found in ```/src/main/java/com/mosip/inji_usecase/service/query```
The configuration files for various services can be found under ```/src/main/resources/validation```

## Endpoints
### ```POST /api/data/ingest```
The requests sent at ```POST /api/data/ingest``` goes through validation layer before being saved. The endpoint receives a JSON object in the BODY with a custom HEADER ```x-source``` that tells clarifies which service it came from. Currently it accepts ```certify``` and ```farmer```.  
Validation is handled by ValidationService which maps it to the correct validation service, whether Certify or Farmer based on the source.  
The implementation for validation is found under ```/src/main/java/com/mosip/inji_usecase/service/validation/```. Config file for the respective service must be under ```/src/main/resources/validation```  
After validation is passed with no errors, it will then be saved by the respective RepositoryService which will save it to the correct database, based on the ```x-source```
The various validation parameters that can be used in the configuration file are:
```
    required,       -- list of necessary fields
    type,           -- the type of the field (string, integer, float, boolean, date, array, object)
    regex,          -- regex pattern that must be followed by the value of the field
    minlength,      -- minimum length/value of the value 
    maxlength,      -- maximum length/value of the field
    conditional,    -- conditional fields required by this field
    unique          -- whether the object is unique or not       (TODO)
```

### ```GET /api/data/retrieve/{id}```
The requests sent at ```GET /api/data/retrieve/{id}``` will go through every database thats been configured and look up at the ID for each table. If multiple matching IDs are found in each database, then it will return a list of Map<String, Object> as response. If none is found, an empty list is returned.  
The implementation for the look up is under ```/src/main/java/com/mosip/inji_usecase/service/repository/```

### ```GET /api/data/query```
Reference used: https://medium.com/@cmmapada/advanced-search-and-filtering-using-spring-data-jpa-specification-and-criteria-api-b6e8f891f2bf
The requests sent at ```GET /api/data/query``` goes through a multi-step process. The request body must contain a valid pre-defined layout. An example is given below
```
{
    "dataOption":"all",
    "searchCriteria":[
       {
          "filterKey":"landId",
          "operation":"bn",
          "value":"dey"
       },
        {
          "filterKey":"name",
          "operation":"cn",
          "value":"De"
       }
    ]
}
```
It must contain a list of criteria objects.  
The valid operations with their respective meanings are:
```
            "cn":CONTAINS;
            "nc":DOES_NOT_CONTAIN;
            "eq":EQUAL;
            "ne":NOT_EQUAL;
            "bw":BEGINS_WITH;
            "bn":DOES_NOT_BEGIN_WITH;
            "ew":ENDS_WITH;
            "en":DOES_NOT_END_WITH;
            "nu":NUL;
            "nn":NOT_NULL;
            "gt":GREATER_THAN;
            "ge":REATER_THAN_EQUAL;
            "lt":LESS_THAN;
            "le":LESS_THAN_EQUAL;
```
The ```dataOption``` tells whether the search should be performed respecting all parameters or any parameters.  
Valid dataOptions are:
```
all
any
```
The implementation for GET /api/data/query is found in ```/src/main/java/com/mosip/inji_usecase/service/query```

## Adding an Use-case
2 example use-cases have been implemented in this application, namely Certify and Farmer
If you want to add your own use case, please reference the implementation of the example use-cases in the relevant folders
The following files, folders have to modified/added for adding an use-case
```
├── init
|   ├── 1-init.sql                                                    --Add your database creation here
|   ├── 2-certify-schema.sql
|   ├── 3-farmer-schema.sql
|   └── 4-example-schema.sql                                          --Add your schema here
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── mosip
│   │   │           └── inji_usecase
│   │   │               ├── config
│   │   │               │   ├── CertifyConfiguration.java
│   │   │               │   ├── FarmerConfiguration.java
|   |   |                   └── ExampleConfiguration.java             --Add your configuration here
│   │   │               ├── dto
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyDto.java
│   │   │               │   ├── farmer
│   │   │               │   |   └── FarmerDto.java
│   │   │               │   └── example                                --Add your dto here
│   │   │               │       └── ExampleDto.java
│   │   │               ├── entity
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyEntity.java
│   │   │               │   ├── farmer
│   │   │               │   │   └── FarmerEntity.java
│   │   │               │   └── example                                --Add your entity here
│   │   │               │       └── ExampleEntity.java
│   │   │               ├── mapper
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyMapper.java
│   │   │               │   ├── farmer
│   │   │               │   │   └── FarmerMapper.java
│   │   │               │   ├── example                                --Add your mapper here
│   │   │               │   │   └── ExampleMapper.java
│   │   │               │   └── MappingUtils.java
│   │   │               ├── repository
│   │   │               │   ├── certify
│   │   │               │   │   └── CertifyRepository.java
│   │   │               │   ├── farmer
│   │   │               │   │   └── FarmerRepository.java
│   │   │               │   └── example                                --Add your repository here
│   │   │               │       └── ExampleRepository.java
│   │   │               └── service
│   │   │                   ├── query
│   │   │                   ├── repository
│   │   │                   │   ├── CertifyRepositoryService.java
│   │   │                   │   ├── FarmerRepositoryService.java
│   │   │                   │   ├── ExampleRepositoryService.java        --Add your repository service here
│   │   │                   │   └── RepositoryService.java
│   │   │                   └── validation
│   │   │                       ├── CertifyValidationService.java
│   │   │                       ├── FarmerValidationService.java
│   │   │                       ├── ExampleValidationService.java        --Add your validation service here
│   │   │                       ├── ValidationService.java
│   │   │                       ├── ValidationType.java
│   │   │                       └── VerifyFieldService.java
│   │   └── resources
│   │       ├── application.properties
│   │       ├── database.properties                                    --Add your database url here
│   │       ├── static
│   │       ├── templates
│   │       └── validation
│   │           ├── certify.json
│   │           ├── farmer.json
│   │           └── example.json                                        --Add your validtion configuration here
                      
```

## Demo Video


https://github.com/user-attachments/assets/dda1043a-676e-4bbc-bc3f-599f7c17b21f


## Subtasks
- [x] Data Ingestion
    - [x] POST request at /api/data/ingest 
    - [x] Dynamic input acceptance
- [ ] Data Validation
    - [x] Required fields validation
    - [x] Data type validation
    - [x] Length/Size constraints
    - [x] Format validation
    - [x] Conditional validation
    - [ ] Uniqueness validation
    - [x] Validation Feedback
- [x] Data Retrieval
    - [x] Data Retrieval at endpoint GET /api/data/retrieve/{id} 
    - [x] Data Retrieval at endpoint GET /api/data/retrieve/query
- [ ] Data Storage
    - [x] Dynamic Database Routing based on source
    - [ ] Dynamic Database Routing based on specific field's value, or round-robin for load balancing
    - [x] Flexible Data Mapping
- [x] Management and Administration
    - [x] Health Check endpoint GET /actuator/health to indicate operational status and connectivity to configured databases
- [ ] Non-Functional Requirements
    - [ ] System must handle atleast 100 concurrent ingestion requests without degradation
    - [x] Configuration changes (validation schema or DB routing) must not require app redeployment
    - [ ] All logs must be traceable via request IDs
    - [ ] System must support pluggable encryption of sensitive data
    - [ ] Response time for ingestion and retrieval APIs should be under 300ms for payloads <1KB

