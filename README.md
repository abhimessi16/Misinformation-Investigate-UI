# Misinformation Investigate - UI

Demo link - https://www.youtube.com/watch?v=mvKfc1Jfy8Q
<hr>
The  user interface which will be used by users to start live feed processing using m3u8 links. Users will be able to check any fake news which have been detected.

## Instructions to run

### Serivices/Apps required
- The User interface
- Live Feed API
- Speech to text API
- Prediction API
- Fact Checking API
- Flink stream processing pipeline
- Kafka broker

### Kafka
<hr>

<b>Requirements</b>

1. Scala 2.13.14
2. Apache Kafka 2.13-3.9.0

We will run the Kafka with KRaft mode
- Format the kraft metadata directory using the command -
    
    bin/kafka-storage.sh format -t <unique_cluster_id> -c config/kraft/server.properties
- Edit the config/kraft/server.properties file
- Add proper listeners and controller ip addresses
- Create kafka topics. Example - 

    bin/kafka-topics.sh --bootstrap-server <ip_addr:9092> --create --topic <topic_name> --partitions <p_count> --replication-factor <rep_count>
- Run the kafka server - 
    bin/kafka-server-start.sh config/kraft/server.properties

### User Interface
<hr>

<b>Requirements</b>

1. Node and npm

Clone this repo

- cd into repo folder
- Run - npm install
- Install the dependencies which are asked
- Run - npm run dev

### Live Feed API
<hr>

<b>Requirements</b>

1. Python 3.12

Clone the repo - https://github.com/abhimessi16/Misinformation-Investigate-Feed-API
- cd into repo folder
- Create a virtual environment - recommended
- Run - pip install -r requirements.txt
- Create a .env file using .envExample. Add the kafka broker urls.
- Change the kafka topic name in params file if necessary
- Run - fastapi run app/main.py (or run using uvicorn on different port)

### Speech to Text API
<hr>

<b>Requirements</b>

1. Python 3.12

Clone the repo - https://github.com/abhimessi16/MI_Processing_STT
- cd into repo folder
- Create a virtual environment - recommended
- Run - pip install -r requirements.txt
- Run - fastapi run app/main.py (or run using uvicorn on different port)

### Prediction API
<hr>

<b>Requirements</b>

1. Python 3.10.12

Clone the repo - https://github.com/abhimessi16/MI_Fake_News_Prediction
- cd into repo folder
- Create a virtual environment - recommended
- Download and add the model and tokenizer files from - https://drive.google.com/drive/folders/1LSrSNxbLMT5yubg_tghWe1suH8qvGkmE?usp=sharing
- If using own models then update the main, params and utils files accordingly
- Run - pip install -r requirements.txt
- Run - fastapi run app/main.py (or run using uvicorn on different port)

### Fact Checking API
<hr>

<b>Requirements</b>

1. Python 3.12

Clone the repo - https://github.com/abhimessi16/MI_Processing_Check
- cd into repo folder
- Create a virtual environment - recommended
- Run - pip install -r requirements.txt
- Create .env file using .envExample. Add your Google API key. This API key must have access to the Google Fact Check Tools API
- Run - fastapi run app/main.py (or run using uvicorn on different port)
<hr>
Can use the same virtual environment for all python APIs except Prediction API.
<hr>

### Flink Streaming

<b>Requirements</b>

1. Java 11
2. Maven

Clone the repo - https://github.com/abhimessi16/mi-processing

- cd into repo folder
- Create application.properties using example.properties file
- Enter all the relevant details in properties file
- If running using jar file then make sure flink dependencies are built. 
    - Follow - https://nightlies.apache.org/flink/flink-docs-release-1.4/start/building.html
    - Run - mvn clean install
    - Run the jar file
- If running as a project
    - make sure all dependencies are built
    - Run DataStreamJob's main method