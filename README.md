# ZooSon
Give it a try! 
Its all about animals.

## SPARQL for querying data

List of questions/tasks for the application.
Console `http://dbpedia.org/sparql`

1. Show me Snake

        SELECT DISTINCT * WHERE {
            ?x0 rdf:type ?type.
            FILTER(regex(?type, "Animal", "i")) .
            ?x0 rdfs:label "Snake"@en.
            ?x0 foaf:depiction ?image.
        }

2. What is Dog ?

        SELECT DISTINCT * WHERE {
            ?x0 rdf:type ?type.
            FILTER(regex(?type, "Animal", "i")) .
            ?x0 rdfs:label "Snake"@en.
            ?x0 rdfs:comment ?comment.
            FILTER(langMatches(lang(?comment), "EN")) .
        }

3. What is Wikipedia link for Dog ?

        SELECT DISTINCT * WHERE {
            ?x0 rdf:type ?type.
            FILTER(regex(?type, "Animal", "i")) .
            ?x0 rdfs:label "Penguin"@en .
            ?x0 prov:wasDerivedFrom ?x1.
        }

4. What is lifespan of "Labrador Retriever" ?

        SELECT *
        WHERE {
            ?x0 dbpprop:name "Labrador Retriever"@en .
            ?x0 rdf:type dbpedia-owl:Species .
            ?x0 dbpprop:lifeSpan ?lifespan
        }

        SELECT *
        WHERE {
         <http://dbpedia.org/resource/Golden_Retriever> dbpprop:lifeSpan ?object
        }

        SELECT *
        WHERE {
         ?x0 dbpprop:name "Labrador Retriever"@en .
         ?x0 rdf:type dbpedia-owl:Species .
         ?x0 dbpprop:lifeSpan ?lifespan .
         ?x0 dcterms:subject ?subjects .
        }

5. Who is creator of Jerry Mouse ?

6. List all mouse characters.

        SELECT *
        WHERE {
            ?x0 dbpedia-owl:species ?class .
            FILTER(regex(?class, "mouse", "i")) .
        }

-- Select Countries and population

        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX type: <http://dbpedia.org/class/yago/>
        PREFIX prop: <http://dbpedia.org/property/>

        SELECT ?country_name ?population
        WHERE {
            ?country a type:LandlockedCountries ;
                     rdfs:label ?country_name ;
                     prop:populationEstimate ?population .
            FILTER (?population > 150000) .
            FILTER(langMatches(lang(?country_name), "EN")).
        }

## Getting Started

1. Create a Bluemix Account

    [Sign up][sign_up] in Bluemix, or use an existing account. Watson Services in Beta are free to use.

2. Download and install the [Cloud-foundry CLI][cloud_foundry] tool

3. Edit the `manifest.yml` file and change the `<application-name>` to something unique.
  ```none
  applications:
  - services:
    - speech-to-text-service
    name: <application-name>
    command: node app.js
    path: .
    memory: 128M
  ```
  The name you use will determinate your application url initially, e.g. `<application-name>.mybluemix.net`.

4. Connect to Bluemix in the command line tool.
  ```sh
  $ cf api https://api.ng.bluemix.net
  $ cf login -u <your user ID>
  ```

5. Create the Speech to Text service in Bluemix.
  ```sh
  $ cf create-service speech_to_text free speech-to-text-service
  ```

6. Push it live!
  ```sh
  $ cf push
  ```

See the full [Getting Started][getting_started] documentation for more details, including code snippets and references.

## Running locally

  The application uses [Node.js][http://nodejs.org/] and [npm][https://www.npmjs.com/] so you will have to download and install them as part of the steps below.

1. Copy the credentials from your `speech-to-text-service` service in Bluemix to `app.js`, you can see the credentials using:

    ```sh
    $ cf env <application-name>
    ```
    Example output:
    ```sh
    System-Provided:
    {
    "VCAP_SERVICES": {
      "speech_to_text": [{
          "credentials": {
            "url": "<url>",
            "password": "<password>",
            "username": "<username>"
          },
        "label": "speech-to-text",
        "name": "speech-to-text-service",
        "plan": "free"
     }]
    }
    }
    ```

    You need to copy `username`, `password` and `url`.

2. Install [Node.js](http://nodejs.org/)
3. Go to the project folder in a terminal and run:
    `npm install`
4. Start the application
5.  `node app.js`
6. Go to `http://localhost:3000`

## Troubleshooting

To troubleshoot your Bluemix app the main useful source of information are the logs, to see them, run:

  ```sh
  $ cf logs <application-name> --recent
  ```

## License

  This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).

## Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

[service_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/speech-to-text.html
[cloud_foundry]: https://github.com/cloudfoundry/cli
[getting_started]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/getting_started/
[sign_up]: https://apps.admin.ibmcloud.com/manage/trial/bluemix.html?cm_mmc=WatsonDeveloperCloud-_-LandingSiteGetStarted-_-x-_-CreateAnAccountOnBluemixCLI
