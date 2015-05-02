/**
 * Created by pradyumnad on 01/05/15.
 */

function startsWith(str, prefix) {
    return str.lastIndexOf(prefix, 0) === 0;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

$(document).ready(function () {

    $("#loadingDiv").hide();
    $(document).ajaxStart(function () {
        $("#loadingDiv").show();
    }).ajaxStop(function () {
        $("#loadingDiv").hide();
    });


    $("#go-btn").click(function (event) {
        $('#resultsDiv').empty();

        var que = $("#question").val();
        console.log(que);

        NLPService.getChunks(que,
            function (result) {
                $("#debug-ta").val(JSON.stringify(result));

                console.log(result);
                var index = -999;
                var data = result.tags;
                var parts = result.tokens;
                var chunks = result.chunks;

                var subjects = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i] == "NNS" || data[i] == "NNP") {
                        subjects[i] = parts[i];
                        index = i;
                        break;
                    }
                }

                if (index < 0) {
                    alert("No animal found in your sentence");
                } else {
                    var type = TEMPLATES.image;
                    type = ZooSonQueTemplate.detect(que);
                    console.log(type);

                    var subject = parts[index];
                    subject = chunks[index];

                    DBPedia.executeSPARQL(type, subject, function(response) {
                        console.log(response);

                        if(type == TEMPLATES.image) {
                            var url = DBPedia.fetchProperty(type, response);
                            console.log(url);

                            $('#resultsDiv').prepend('<img class="img img-responsive center-block" style="height: 100%" id="theImg" src="'+url+'" />');
                        } else if(type == TEMPLATES.about) {
                            var about = DBPedia.fetchProperty(type, response);
                            console.log(about);

                            $('#resultsDiv').prepend('<h4 id="theAbout">'+about+'</h4>')
                        } else if(type == TEMPLATES.prop) {
                            var details = DBPedia.fetchProperty(type, response);
                            console.log(details);

                            $('#resultsDiv').prepend('<h2 id="theAbout">'+details+'</h2>')
                        }

                    }, function(response) {
                        console.log(response);
                    });
                }
            }, function (res) {
                $("#debug-ta").val(JSON.stringify(res));
                console.log(res);
            }
        );
    });

    $("a.list-group-item").click(function (event) {
        event.preventDefault();
        console.log(event.target);

        var que = $(this).text();
        console.log(que);

        $("#question").val(que);

        $("#go-btn").trigger( "click" );
    });
});