/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function () {
        checkConnection();
    },


};

app.initialize();

/*///////////////inizio utilities//////////////*/

function display_results(contenitore, messaggio) {
    $(contenitore).text(messaggio);
};

/*per network info*/
function checkConnection() {
    var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';
    if (states[networkState] == 'Unknown connection' || states[networkState] == 'No network connection') {

        setTimeout(function () {
            //noconnessione();
        }, 9000);
        //alert('Non sei connesso ad internet, connettiti ad una rete per procedere.');
        return false

    } else {
        //display_results("h1", "ok");
        return true
    }
}
var createCORSRequest = function (method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // Most browsers.
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        // IE8 & IE9
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        // CORS not supported.
        xhr = null;
    }
    return xhr;
};

//var dataarpa = 20181010

/*ogni volta setto la data di oggi*/
var iqa = 0;
var today = new Date();
var mese = today.getMonth() + 1;
var annon = today.getYear();
var annok = annon.toString();
// data per la query alle API arpa per IQA
var dataarpa = "20" + annok.slice(1) + mese.toString() + today.getDate();

// data per umani
var mesi = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"]

display_results(".datatop h1 span#day", today.getDate());
display_results(".datatop h1 span#month", mesi[today.getMonth()]);
display_results(".datatop h1 span#year", "20" + annok.slice(1));


var url = 'https://apps.arpae.it/REST/qa_modello/' + dataarpa + '?projection={"dati.istat_037006":1}';
//var urlC="https://www.arpae.it/qualita-aria/bollettino-qa/json"

var method = 'GET';
var xhr = createCORSRequest(method, url);

xhr.onload = function () {
    var responseText = xhr.responseText;

    setTimeout(function () {
        connesso();
    }, 9000);
    console.log(responseText);
    // process the response.
    var obj = jQuery.parseJSON(responseText);
    iqa = obj.dati.istat_037006.iqa;
    //display_results("h3", obj.dati.istat_037006.iqa);
    stampaaggettivoiqa();
};

xhr.onerror = function () {
    //display_results("h3", 'There was an error!');
    console.log('There was an error!');
};


xhr.send();

function changebackground(bck, color) {
    $(bck).css("background-color", color);
}

/*///////////////fine utilities//////////////*/

function noconnessione() {
    $("div.block.rainbow ").css("background-color", "#E1E1E1")
    $("#noconnesso").removeClass("hide");
    display_results("h1", "Errore");
}

function connesso() {
    //$("div.block.rainbow ").css("background-color", "#00E676")
    $("#connesso").removeClass("hide");
}
// scala iqa https://www.arpae.it/dettaglio_generale.asp?id=938&idlivello=134&disab_redirautom_mob=1

function stampaaggettivoiqa() {
    switch (true) {
        case (iqa < 50):
            display_results("#aggettivoiqa", "buona");
            changebackground("div.block.rainbow", "#00E676");
            break;
        case (50 <= iqa <= 99):
            display_results("#aggettivoiqa", "accettabile");
            changebackground("div.block.rainbow", "#FFEA00");
            scrivifrase("accettabile");
            break;
        case (100 <= iqa <= 149):
            display_results("#aggettivoiqa", "mediocre");
            changebackground("div.block.rainbow", "#FFC600");
            break;
        case (150 <= iqa <= 199):
            display_results("#aggettivoiqa", "scadente");
            changebackground("div.block.rainbow", "#FF5722");
            break;
        case (iqa >= 200):
            display_results("#aggettivoiqa", "pessima");
            changebackground("div.block.rainbow", "#9E005D");
            break;
        default:
            console.log("iqa nd");
            break;
    };
}

/* test frasi online */
// https://www.joomla.it/articoli-della-community.feed?type=rss

$.get("https://www.joomla.it/articoli-della-community.feed?type=rss", function (data) {
    $(data).find("entry").each(function () { // or "item" or whatever suits your feed
        var el = $(this);

        console.log("------------------------");
        console.log("title      : " + el.find("title").text());
        console.log("author     : " + el.find("author").text());
        console.log("description: " + el.find("description").text());
    });
});

/* test frasi offline http://api.jquery.com/jquery.ajax/  */

var nbuona = 0;
var arraybuona = [];
var indicearraybuona = 0;

var naccettabile = 0;
var arrayaccettabile = [];
var indicearrayaccettabile = 0;

var nmediocre = 0;
var arraymediocre = [];
var indicearraymediocre = 0;

var nscadente = 0;
var arrayscadente = [];
var indicearrayscadente = 0;

var npessima = 0;
var arraypessima = [];
var indicearraypessima = 0;

function scrivifrase(argomento) {
    $.ajax({
        'async': true,
        'global': false,
        'url': "/frasi/" + argomento + ".json",
        'dataType': "json",
        'success': function (data) {
            //console.log(data.resources.length);
            //console.log(data.resources);
            frasi = $(data.resources);
            //console.log(frasi[2].name);

            if (localStorage.getItem(argomento)) {
                // console.log("esiste");
                var compara = 0;
                compara = parseInt(localStorage.getItem(argomento)) - 1;
                if (data.resources.length != localStorage.getItem(argomento)) {
                    console.log("fineciclo1");
                    localStorage.clear();
                    scrivifrase(argomento);
                } else {
                    var dovesono = 0;
                    var dovevado = [];
                    var andiamo = 0;

                    dovesono = localStorage.getItem("mioindice" + argomento);
                    dovesono = parseInt(dovesono) + 1;
                    dovevado = localStorage.getItem("sequenza" + argomento);
                    dovevado = dovevado.split(',').map(function (item) {
                        return parseInt(item, 10);
                    });
                    var compara = 0;
                    compara = parseInt(localStorage.getItem(argomento)-1);
                    console.log(compara);
                    console.log(dovesono);
                    //console.log(dovesono + " array " + dovevado);
                    andiamo = dovevado[dovesono];
                    //console.log(andiamo);
                    localStorage.setItem("mioindice" + argomento, dovesono);
                    //scrivo
                    display_results("#fraseiqa", frasi[andiamo].name);
                    display_results("#sottofraseiqa", frasi[andiamo].content);
                    if (dovesono == compara) {
                        console.log("fineciclo2");
                        localStorage.clear();
                        scrivifrase(argomento);
                    }

                }

            } else {
                //console.log("non esiste");
                // scrivo le 3 cose che mi servono: lunghezza, sequenza, mioindice

                frasi = $(data.resources);
                localStorage.setItem(argomento, data.resources.length);

                var N = [];
                N = Array.apply(null, {
                    length: data.resources.length
                }).map(Number.call, Number);
                console.log(N);
                arr = shuffle(N);
                console.log(arr);

                localStorage.setItem("sequenza" + argomento, arr);
                localStorage.setItem("mioindice" + argomento, 0);
                //scrivo
                display_results("#fraseiqa", frasi[0].name);
                display_results("#sottofraseiqa", frasi[0].content);
            };
        }
    });

};

function arrayordinato(numero) {
    // array ordinato
    Array.apply(null, {
        length: numero
    }).map(Number.call, Number)
}



// https://bost.ocks.org/mike/shuffle/

function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
