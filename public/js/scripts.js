function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].style.backgroundColor = "";
    }

    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";

    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
    if (pageName == 'Library') {
        displayLibrary()
    }
}

function saveSong(row) {
    if (localStorage.getItem('library') === null) {
        var storage = [row];
        localStorage.setItem('library', JSON.stringify(storage))
        console.log('Creating new library...')
    } else {
        var library = JSON.parse(localStorage.getItem('library'))
        library.push(row)
        localStorage.setItem('library', JSON.stringify(library));
    }
}

function deleteSong(index) {
    var local = loadSongs()
    local.splice(index - 1, 1);
    localStorage.setItem('library', JSON.stringify(local))
    console.log("Item Deleted: " + localStorage.getItem('library'))
    displayLibrary()
}

function loadSongs() {
    return JSON.parse(localStorage.getItem('library'))
}

function addToLibrary(song, id) {
    var addAction = document.getElementById(id).parentElement
    var temp
    addAction.className = 'deleteCell'
    document.getElementById(id).remove()
    if (song.childNodes[0].className == 'rank') {
        song = song.cloneNode(true)
        song.childNodes[0].remove()
    }
    saveSong(song.outerHTML)
    addAction.removeAttribute('class')
    console.log("Adding Song: " + song.outerHTML)
}

function displayLibrary() {
    var header = "<tr><th>Song</th><th>Artist</th><th>Album</th><th>Lyrics</th><th>Delete</th></tr>"
    if (loadSongs() === null) {
        var local = null;
    } else {
        var local = loadSongs().join('')
    }
    if (local === null || local == []) {
        document.getElementById('displayLib').innerHTML = "<br/><br/><h4>You haven't saved any songs yet...</h4><br/><br/>"
    } else {
        document.getElementById('displayLib').innerHTML = header + local
        deleteButtons = document.getElementsByClassName('deleteCell')
        for (i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].innerHTML = "<button class = 'deleteButton' onclick = 'deleteSong(this.parentNode.parentNode.rowIndex)'>X</button>"
        }
    }
}

function validateSearch() {
    inputVal = document.getElementById("SearchBox").value
    if (inputVal.length == 0) {
        makeVisible('error')
    } else {
        makeInvisible('error')
        // document.getElementById('trackResults').innerHTML += ("<p>Songs like " + inputVal + "</p>")
        // document.getElementById('artistResults').innerHTML += ("<p>Artists like " + inputVal +"</p>")

        document.getElementById('trackHeader').innerHTML = ("<p>Songs like " + "\"" + inputVal + "\"" + "</p>")
        document.getElementById('artistHeader').innerHTML = ("<p>Songs by Artists like " + "\"" + inputVal + "\"" + "</p>")

        searchByTrackName(inputVal);
        searchByArtistName(inputVal);
        // artistRanking(inputVal)
    }
}

function searchByArtistName(query) {
    var divName = "artistResults"
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            q_artist: query,
            s_track_rating: "DESC",
            s_artist_rating: "DESC",
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            data = data.message.body.track_list
            serveResultsTable(data, divName)
            document.getElementById('searchResults').style.visibility = 'visible'
        }
    })
}

function searchByTrackName(query) {
    var divName = "trackResults"
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            q_track: query,
            s_artist_rating: "DESC",
            //s_track_rating: "DESC",
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            data = data.message.body.track_list
            serveResultsTable(data, divName)
            document.getElementById('searchResults').style.visibility = 'visible'
        }
    })
}

function lyricsSearch(query) {
    var divName = ""
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            q: query,
            s_track_rating: "DESC",
            s_artist_rating: "DESC",
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/lyrics.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            data = data.message.body.track_list
            serveResultsTable(data, divName)
            document.getElementById('searchResults').style.visibility = 'visible'
        }
    })
}

function generalQuery(query) {
    var divName = ""
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            q: query,
            s_track_rating: "DESC",
            s_artist_rating: "DESC",
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            data = data.message.body.track_list
            serveResultsTable(data, divName)
            document.getElementById('searchResults').style.visibility = 'visible'
        }
    })
}

function artistChartsByCountry(countryValue, divName) {
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            //q_artist: query,
            country: countryValue,
            page_size: 25,
            //s_artist_rating: "DESC",
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/chart.artists.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            console.log(data)
            data = data.message.body.artist_list
            serveArtistResultsTable(data, divName)
            document.getElementById(divName).style.visibility = 'visible'
        }
    })
}

function trackChartsByCountry(countryValue, divName) {
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            //q_track: query,
            country: countryValue,
            page_size: 25,
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/chart.tracks.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            data = data.message.body.track_list
            serveResultsTable(data, divName)
            document.getElementById(divName).style.visibility = 'visible'
        }
    })
}

function chartsSearchByCountry(divName) {
    document.getElementById('exploreSongs').style.visibility = 'hidden'
    var country = document.getElementById('countrySelector')
    var countryValue = country.options[country.selectedIndex].value
    var type = document.getElementById('typeSelector')
    var typeValue = type.options[type.selectedIndex].value

    if (typeValue == 'track') {
        document.getElementById(divName).style.maxWidth = "800px"
        trackChartsByCountry(countryValue, divName)
    } else {
        document.getElementById(divName).style.maxWidth = "300px"
        artistChartsByCountry(countryValue, divName)
    }
}

function serveResultsTable(data, divName) {
    var table = "<table><tr> <th>Song</th> <th>Artist</th> <th>Album</th> <th>Lyrics</th> <th>Save</th> </tr>"
    for (i = 0; i < data.length; i++) {

        table +=
            "<tr " + "id=" + data[i].track.track_id + ">" + "<td>" + data[i].track.track_name + "</td>" +
            "<td>" + data[i].track.artist_name + "</td>" +
            "<td>" + data[i].track.album_name + "</td>" +
            "<td>" + "<button class = 'lyrics'" + " onclick = getLyrics(this.parentElement.parentElement.id)" + ">" + "♪" + "</button>" + "</td>" +
            "<td>" + "<button class = 'add' id = b_" + divName + i + " onclick = addToLibrary(this.parentNode.parentNode,this.id)" + ">" + "+" + "</button>" + "</td>";
    };
    table += "</table>";
    console.log(table)
    document.getElementById(divName).innerHTML = table
}

function serveSongResultsTable(artist, data, divName) {
    var title = "<h4>Top tracks by \"" + artist.innerHTML + "\"</h4>"
    var table = "<table><tr> <th>Rank</th> <th>Song</th> <th>Artist</th> <th>Album</th> <th>Lyrics</th> <th>Save</th> </tr>"
    for (i = 0; i < data.length; i++) {
        table +=
            "<tr " + "id=" + data[i].track.track_id + ">" +
            "<td class = 'rank'> <b>" + (i + 1) + ".</b> </td>" +
            "<td>" + data[i].track.track_name + "</td>" +
            "<td>" + data[i].track.artist_name + "</td>" +
            "<td>" + data[i].track.album_name + "</td>" +
            "<td>" + "<button class = 'lyrics'" + " onclick = getLyrics(this.parentElement.parentElement.id)" + ">" + "♪" + "</button>" + "</td>" +
            "<td>" + "<button class = 'add' id = b_" + divName + i + " onclick = addToLibrary(this.parentNode.parentNode,this.id)" + ">" + "+" + "</button>" + "</td>";
    };
    table += "</table>";
    console.log(table)
    document.getElementById(divName).innerHTML = title + table
}

function serveArtistResultsTable(data, divName) {
    var table = "<table><tr> <th><b>Rank</b></th> <th><b>Artist</b></th> <th>Songs</th> </tr>"
    for (i = 0; i < data.length; i++) {
        table +=
            "<tr " + "id=" + data[i].artist.artist_id + "><td><b>" + (i + 1) + ".</b></td>" + "<td>" + data[i].artist.artist_name + "</td>" + "<td><button class='expandSongs' onclick='expandSongs(this.parentNode.parentNode.id,this.parentNode.parentNode.childNodes[1],\"exploreSongs\")'>♫</button></td>" + "</tr>";
    };
    table += "</table>";
    console.log(table)
    document.getElementById(divName).innerHTML = table
}

function expandSongs(id, artist, divName) {
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            f_artist_id: id,
            s_track_rating: "DESC",
            page_size: 10,
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/track.search",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            console.log(data)
            data = data.message.body.track_list
            serveSongResultsTable(artist, data, divName)
            document.getElementById(divName).style.visibility = 'visible'
        }
    })
}

function getLyrics(id) {
    console.log('Gettting lyrics for ' + id)
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            track_id: id,
            format: "jsonp",
            callback: "jsonp_callback"
        },
        url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get",
        dataType: "jsonp",
        jsonpCallback: 'jsonp_callback',
        success: function (data) {
            console.log('Data')
            console.log(data)
            var lyrics
            if (data.message.body === undefined || data.message.body.length == 0) {
                lyrics = "<p> Lyrics not found for the selected song. </p>"
            } else {
                lyrics = ("<p>" + data.message.body.lyrics.lyrics_body + "</p>")
            }
            displayModal(lyrics)
        }
    })
}

function makeVisible(elmnt) {
    document.getElementById(elmnt).style.visibility = 'visible'
}

function makeInvisible(elmnt) {
    x = document.getElementById(elmnt).style.visibility = 'hidden'
}

function displayModal(lyrics) {
    // Get the modal
    var modal = document.getElementById("myModal");

    document.getElementsByClassName("modal-body")[0].innerHTML = lyrics
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function enterToSearch() {
    var input = document.getElementById("SearchBox");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            document.getElementsByClassName("searchButton")[0].click();
        }
    });
}

// Get the element with id="defaultOpen" and click on it
window.addEventListener('load', function () {
    document.getElementById("defaultOpen").click();
    document.getElementsByClassName('searchButton')[1].click();
    document.getElementById('SearchBox').focus();
    enterToSearch()
})