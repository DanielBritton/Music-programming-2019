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

function displayLibrary() {
    var header = "<tr><th>Song</th><th>Artist</th><th>Album</th><th>Delete</th></tr>"
    var local = loadSongs().join('')
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

function loadSongs() {
    return JSON.parse(localStorage.getItem('library'))
}

function validateSearch() {
    inputVal = document.getElementById("inputVal").value
    if (inputVal.length == 0) {
        makeVisible('error')
    } else {
        makeInvisible('error')
        // document.getElementById('trackResults').innerHTML += ("<p>Songs like " + inputVal + "</p>")
        // document.getElementById('artistResults').innerHTML += ("<p>Artists like " + inputVal +"</p>")

        document.getElementById('trackHeader').innerHTML = ("<p>Songs like " + "\"" + inputVal + "\"" + "</p>")
        document.getElementById('artistHeader').innerHTML = ("<p>Artists like " + "\"" + inputVal + "\"" + "</p>")

        searchByTrackName(inputVal)
        searchByArtistName(inputVal);
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

function serveResultsTable(data, divName) {
    var table = "<table><tr> <th>Song</th> <th>Artist</th> <th>Album</th> <th>Save</th> </tr>"
    for (i = 0; i < data.length; i++) {

        table +=
            "<tr " + "id=" + divName + i + ">" + "<td>" + data[i].track.track_name + "</td>" +
            "<td>" + data[i].track.artist_name + "</td>" +
            "<td>" + data[i].track.album_name + "</td>" +
            "<td>" + "<button class = 'add' id = b_" + divName + i + " onclick = addToLibrary(this.parentNode.parentNode,this.id)" + ">" + "+" + "</button>" + "</td>";
    };
    table += "</table>";
    console.log(table)
    document.getElementById(divName).innerHTML = table
}

function addToLibrary(song, id) {
    song.removeAttribute('id')
    var action = document.getElementById(id).parentElement
    action.className = 'deleteCell'
    document.getElementById(id).remove()
    saveSong(song.outerHTML)
    action.removeAttribute('class')
    console.log("Adding Song: " + song.outerHTML)
}

function makeVisible(elmnt) {
    document.getElementById(elmnt).style.visibility = 'visible'
}

function makeInvisible(elmnt) {
    x = document.getElementById(elmnt).style.visibility = 'hidden'
}

// Get the element with id="defaultOpen" and click on it
window.addEventListener('load', function () {
    document.getElementById("defaultOpen").click();
})