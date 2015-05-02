/**
 * Created by pradyumnad on 01/05/15.
 */

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

        NLPService.getPOS(que,
            function (result) {
                $("#debug-ta").val(JSON.stringify(result));

                console.log(result);
                var index = -999;
                var data = result.results;
                var parts = result.tokens;

                for (var i = 0; i < data.length; i++) {
                    if (data[i] == "NN" || data[i] == "NNS" || data[i] == "NNP") {
                        index = i;
                        break;
                    }
                }

                if (index < 0) {
                    alert("No animal found in your sentence");
                } else {
                    var subject = parts[index];
                    DBPedia.executeSPARQL(TEMPLATES.image, subject, function(response) {
                        console.log(response);

                        var url = DBPedia.fetchProperty(TEMPLATES.image, response);
                        console.log(url);

                        $('#resultsDiv').prepend('<img class="img-thumbnail" id="theImg" src="'+url+'" />')

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