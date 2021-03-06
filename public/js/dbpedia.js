/**
 * Created by pradyumnad on 30/04/15.
 */

/**
 * SERVICES
 *
 * https://github.com/dbpedia/lookup
 * http://lookup.dbpedia.org/api/search.asmx/PrefixSearch?QueryClass=Animal&MaxHits=5&QueryString=Aar
 * http://lookup.dbpedia.org/api/search.asmx/KeywordSearch?QueryString=Aardwolf
 *
 * NOTE:
 * http://quepy.machinalis.com/
 */

var prefixURL = "http://lookup.dbpedia.org/api/search.asmx/PrefixSearch";

/**
 *
 * @type {string}
 * @examle http://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+DISTINCT+*+WHERE+%7B%0D%0A++++%3Fx0+rdf%3Atype+%3Ftype.%0D%0A++++FILTER%28regex%28%3Ftype%2C+%22Animal%22%2C+%22i%22%29%29+.%0D%0A++++%3Fx0+rdfs%3Alabel+%22Penguin%22%40en+.%0D%0A++++%3Fx0+prov%3AwasDerivedFrom+%3Fx1.%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&debug=on
 */
var sparqlURL = "http://dbpedia.org/sparql";
var fillKey = "__XXX__";

var showPattern = /Show me [A-Za-z]*[\s]?/gi;
var showQuery =
    "SELECT DISTINCT * WHERE {"+
        "?x0 rdf:type ?type ."+
        "FILTER(regex(?type, \"Animal\", \"i\")) ."+
        "?x0 rdfs:label \"__XXX__\"@en."+
        "?x0 foaf:depiction ?image."+
        "}";

var imageQuery =
    "SELECT DISTINCT *"+
    "WHERE {"+
        "?x0 rdf:type <http://dbpedia.org/ontology/Species> ."+
        "?x0 rdfs:label ?name ."+
        "FILTER(regex(?name, \"^__XXX__\", \"i\")) ."+
        "FILTER(langMatches(lang(?name), 'EN')) ."+
        "?x0 foaf:depiction ?image."+
    "}";

var aboutPattern = /What is [A-Za-z]*[\s]?\?/gi;
var aboutQuery =
    "SELECT DISTINCT * WHERE {"+
        "?x0 rdf:type ?type."+
        "FILTER(regex(?type, \"Species\", \"i\")) ."+
        "?x0 rdfs:label \"__XXX__\"@en."+
        "?x0 rdfs:comment ?comment."+
        "FILTER(langMatches(lang(?comment), \"EN\")) ."+
    "}";

var listQuery =
    "SELECT *"+
    "WHERE {"+
        "?x0 dbpedia-owl:species ?class ."+
        "FILTER(regex(?class, \"^__XXX__\", \"i\")) ."+
    "}";

var propPattern = /What is [A-Za-z]* of [A-Za-z\s]*[\s]?\?/gi;
var propQuery =
    "SELECT *"+
    "WHERE {"+
        "?x0 dbpprop:name \"__XXX__\"@en ."+
        "?x0 rdf:type dbpedia-owl:Species ."+
        "?x0 dbpprop:lifeSpan ?lifespan"+
    "}";

function DBPedia() {

}

DBPedia.prefixSearch = function(prefix) {
    var params = {
        QueryClass: "Animal",
        MaxHits: 5,
        QueryString: prefix
    };

    $.get(prefixURL, params, function(response) {
        console.log(response);
    }).fail(function(response) {
        console.log(response);
    });
};

DBPedia.executeSPARQL = function(type, subject, success, fail) {

    var query = "SELECT DISTINCT ?type WHERE { ?x0 rdf:type ?type } LIMIT 5";

    if(type == TEMPLATES.image) {
        query = showQuery;
        query = query.replace(fillKey, subject);
    } else if (type == TEMPLATES.about) {
        query = aboutQuery;
        query = query.replace(fillKey, subject);
    } else if (type == TEMPLATES.prop) {
        query = propQuery;
        query = query.replace(fillKey, subject);
    }

    console.log(query);

    var params = {
        'default-graph-uri': "http://dbpedia.org",
        'query': query,
        'format': "application/sparql-results+json",
        'timeout': 3000
    };

    $.get(sparqlURL, params, function(response) {
        success(response);
    }).fail(function(response) {
        fail(response);
    });
};

DBPedia.fetchProperty = function(type, result) {
    var bindings = result.results.bindings;

    if(type == TEMPLATES.image) {
        if(bindings.length > 0) {
            var object = bindings[0];
            return object.image.value;
        } else {
            alert("No results from the DB");
        }
    } else if(type == TEMPLATES.about) {
        if(bindings.length > 0) {
            var object = bindings[0];
            return object.comment.value;
        } else {
            alert("No results from the DB");
        }
    } else if(type == TEMPLATES.prop) {
        if(bindings.length > 0) {
            var object = bindings[0];

            var lifespanString = object.lifespan.value;
            var res = lifespanString.split("E");
            var lifespan = parseFloat(res[0])*Math.pow(10, parseInt(res[1]))/(60*60*24*30*12);
            lifespan = Math.round(lifespan*100.0)/100.0

            return lifespan+" Years";
        } else {
            alert("No results from the DB");
        }
    }
};

function NLPService() {

}

NLPService.getPOS = function(string, success, fail) {
    var base_url = "https://nlpservices.mybluemix.net/api/service/pos/";
    var url = base_url + encodeURIComponent(string);
    console.log(url);

    $.get(url,
        function (result) {
//            console.log(result);
            success(result);
        }
    ).fail(
        function (data) {
//            console.log(data);
            fail(data);
        }
    );
};

NLPService.getChunks = function(string, success, fail) {
    var base_url = "https://nlpservices.mybluemix.net/api/service/chunks/";
    var url = base_url + encodeURIComponent(string);
    console.log(url);

    $.get(url,
        function (result) {
//            console.log(result);
            success(result);
        }
    ).fail(
        function (data) {
//            console.log(data);
            fail(data);
        }
    );
};


var TEMPLATES = {
    image: "What does a XXX look like ?",
    about: "What is X ?",
    prop: "What is lifespan of X ?",
    creator: "Who is creator of X ?"
};

function ZooSonQueTemplate () {

}

ZooSonQueTemplate.detect = function(question) {
    if(showPattern.test(question)) {
        return TEMPLATES.image;
    } else if(aboutPattern.test(question)) {
        return TEMPLATES.about;
    } else if(propPattern.test(question)) {
        return TEMPLATES.prop;
    }

    return "";
};