/**
 * @description Hide all tabs, Make the required tab visible,
 *              and set the background color.
 * @param {id} pageName 
 * @param {HTMLDivElement} elmnt 
 * @param {String} color 
 */
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

/**
 * @description Take a HTML row element and save it to library.
 * @param {HTMLTableRowElement} row 
 */
function saveSong(row) {
    // If a library doesn't exist, create one using the row element as the first item.
    // Use localStorage to assign the String storage to an item called 'library'. 
    if (localStorage.getItem('library') === null) {
        var storage = [row];
        localStorage.setItem('library', JSON.stringify(storage))
        console.log('Creating new library...')
    } else {
        var library = loadSongs()
        // The library should not contain duplicate songs. 
        if (!library.includes(row)) {
            library.push(row)
            localStorage.setItem('library', JSON.stringify(library));
            console.log("Adding Song: " + row)
        } else {
            console.log("Library already contains selected song")
        }
    }
}

/**
 * @description Delete the song at index in the library
 * @param {Int} index 
 */
function deleteSong(index) {
    var local = loadSongs()
    local.splice(index - 1, 1);
    localStorage.setItem('library', JSON.stringify(local))
    console.log("Item Deleted: " + localStorage.getItem('library'))
    // Refresh the library display
    displayLibrary()
}

/**
 * @description Return Array of songs from localStorage 'library'
 * @returns Array
 */
function loadSongs() {
    return JSON.parse(localStorage.getItem('library'))
}

/**
 * @description Add song to the library and hide the 'add' button.
 * @param {HTMLTableRowElement} song
 * @param {id} id
 */
function addToLibrary(song, id) {
    var addAction = document.getElementById(id).parentElement
    //Replaces the 'add' button with a 'delete' button for the library
    addAction.className = 'deleteCell'
    document.getElementById(id).remove()
    var lsong = song.cloneNode(true)
    // If song is in the Explore page, remove the 'rank' <td> element 
    if (lsong.childNodes[0].className == 'rank') {
        lsong.childNodes[4].childNodes[0].setAttribute('onclick', "getVideo(this,'library')")
        lsong.childNodes[0].remove()
    }
    saveSong(lsong.outerHTML)
    addAction.removeAttribute('class')
}

/**
 * @description Display the library table in the 'Library' tab
 */
function displayLibrary() {
    var header = "<tr> <th>Song</th> <th>Artist</th> <th>Album</th> <th>Play</th> <th>Lyrics</th> <th>Delete</th> </tr>"
    // Load the Array into Array local
    if (loadSongs() === null) {
        var local = null;
    } else {
        var local = loadSongs().join('')
    }
    // Display an empty message or the users library
    if (local === null || local == []) {
        document.getElementById('displayLib').innerHTML = "<br/><br/><h4>You haven't saved any songs yet...</h4><br/><br/>"
    } else {
        document.getElementById('displayLib').innerHTML = header + local
        // Populate the library table with delete buttons
        deleteButtons = document.getElementsByClassName('deleteCell')
        for (i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].innerHTML = "<button class = 'deleteButton' onclick = 'deleteSong(this.parentNode.parentNode.rowIndex)'>X</button>"
        }
    }
}

/**
 * @description Verify that the user has entered a valid search and if so run Search
 */
function validateSearch() {
    inputVal = document.getElementById("SearchBox").value
    if (inputVal.length == 0) {
        // Show an error message if the user hasn't entered anything
        makeVisible('error')
    } else {
        makeInvisible('error')
        // Set the header and run the track search
        document.getElementById('trackHeader').innerHTML = ("<p>Songs like " + "\"" + inputVal + "\"" + "</p>")
        searchByTrackName(inputVal);
        // Set the header and run the artist search
        document.getElementById('artistHeader').innerHTML = ("<p>Songs by Artists like " + "\"" + inputVal + "\"" + "</p>")
        searchByArtistName(inputVal);
    }
}

/**
 * @description Search for songs by Artist name
 * @param {String} query 
 */
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

/**
 * @description Search for songs by Track name
 * @param {String} query
 */
function searchByTrackName(query) {
    var divName = "trackResults"
    $.ajax({
        type: "GET",
        data: {
            apikey: "802224f7ee4779fbc74a6ebaf2347221",
            q_track: query,
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

/**
 * @description Query Artist songs by charts and country
 * @param {String} countryValue 
 * @param {id} divName 
 */
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

/**
 * @description Query tracks by charts and country
 * @param {String} countryValue
 * @param {id} divName
 */
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
            serveTrackResultsTable('', data, divName)
            document.getElementById(divName).style.visibility = 'visible'
        }
    })
}

/**
 * @description Get Explore page selector values and call the required search
 *              function
 * @param {id} divName 
 */
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

/**
 * @description Constructs a table containing search results and places
 *              it in the required div.
 * @param {JSON} data 
 * @param {id} divName 
 */
function serveResultsTable(data, divName) {
    if (data === undefined || data.length == 0) {
        var table = "<p>No Results Found</p>"
    } else {
        var table = "<table><tr> <th>Song</th> <th>Artist</th> <th>Album</th> <th>Play</th> <th>Lyrics</th> <th>Save</th> </tr>"
        for (i = 0; i < data.length; i++) {
            table +=
                "<tr " + "id=" + data[i].track.track_id + ">" + "<td>" + data[i].track.track_name + "</td>" +
                "<td>" + data[i].track.artist_name + "</td>" +
                "<td>" + data[i].track.album_name + "</td>" +
                "<td>" + "<button class = 'play'" + " onclick = getVideo(this,'search')" + ">" + "▶" + "</button>" + "</td>" +
                "<td>" + "<button class = 'lyrics'" + " onclick = getLyrics(this.parentElement.parentElement.id)" + ">" + "♪" + "</button>" + "</td>" +
                "<td>" + "<button class = 'add' id = b_" + divName + i + " onclick = addToLibrary(this.parentNode.parentNode,this.id)" + ">" + "+" + "</button>" + "</td>";
        };
        table += "</table>";
        console.log(table)
    }
    document.getElementById(divName).innerHTML = table
}

/**
 * @description 
 * @param {String} artist 
 * @param {JSON} data 
 * @param {id} divName 
 */
function serveTrackResultsTable(artist, data, divName) {
    if (artist !== undefined && artist.length != 0) {
        var title = "<h4>Top tracks by \"" + artist.innerHTML + "\"</h4>"
    } else {
        var country = document.getElementById('countrySelector')
        var countryValue = country.options[country.selectedIndex].innerHTML
        var title = "<h4>Top tracks in " + countryValue + "</h4>"
    }
    if (data === undefined || data == 0) {
        var table = "<p>No Results Found</p>"
    } else {
        var table = "<table><tr> <th>Rank</th> <th>Song</th> <th>Artist</th> <th>Album</th> <th>Play</th> <th>Lyrics</th> <th>Save</th> </tr>"
        for (i = 0; i < data.length; i++) {
            table +=
                "<tr " + "id=" + data[i].track.track_id + ">" +
                "<td class = 'rank'> <b>" + (i + 1) + ".</b> </td>" +
                "<td>" + data[i].track.track_name + "</td>" +
                "<td>" + data[i].track.artist_name + "</td>" +
                "<td>" + data[i].track.album_name + "</td>" +
                "<td>" + "<button class = 'play'" + " onclick = getVideo(this,'explore')" + ">" + "▶" + "</button>" + "</td>" +
                "<td>" + "<button class = 'lyrics'" + " onclick = getLyrics(this.parentElement.parentElement.id)" + ">" + "♪" + "</button>" + "</td>" +
                "<td>" + "<button class = 'add' id = b_" + divName + i + " onclick = addToLibrary(this.parentNode.parentNode,this.id)" + ">" + "+" + "</button>" + "</td>";

        };
        table += "</table>";
        console.log(table)
    }
    document.getElementById(divName).innerHTML = title + table
}

/**
 * @description Display Artist charts data
 * @param {JSON} data 
 * @param {id} divName 
 */
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

/**
 * @description Expand a list of songs by the selected artist
 * @param {String} id
 * @param {String} artist
 * @param {id} divName
 */
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
            serveTrackResultsTable(artist, data, divName)
            document.getElementById(divName).style.visibility = 'visible'
        }
    })
}

/**
 * @description Fetches song lyrics using id
 * @param {id} id 
 */
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
                var lyr = data.message.body.lyrics.lyrics_body
                lyr = lyr.substring(0, lyr.indexOf('***'))
                lyrics = ("<pre>" + lyr + "</pre>")
            }
            displayLyrics(lyrics, 'lyricsModal')
        }
    })
}

/**
 * @description Construct and run a query to fetch the YouTube video for the
 *              selected song.
 * @param {HTMLButtonElement} elem 
 * @param {String} type 
 */
function getVideo(elem, type) {
    var song = elem.parentNode.parentNode;
    // var addToLib = undefined;
    // if (song.childNodes[5] != 'deleteCell') {
    //     addToLib = "<button onclick='addToLibrary(song,this.id)'>Add to Library</button>"
    // }
    if (type == 'explore') {
        var query = song.childNodes[1].innerHTML + " " + elem.parentNode.parentNode.childNodes[2].innerHTML
    } else {
        var query = song.childNodes[0].innerHTML + " " + elem.parentNode.parentNode.childNodes[1].innerHTML
    }
    console.log(query)
    $.ajax({
        type: 'GET',
        url: 'https://www.googleapis.com/youtube/v3/search',
        data: {
            key: 'AIzaSyDlxpiKwKZrTNbXo18Hu1FWbNiM43gMjG8',
            q: query + ' song',
            part: 'snippet',
            maxResults: 1,
            type: 'video',
            videoEmbeddable: true,
        },
        success: function (data) {
            embedVideo(data)
        },
        error: function (response) {
            console.log("Request Failed");
        }
    });
}

/**
 * @description Constructs a YouTube embedded URL and passes it to the
 *              displayModal function
 * @param {JSON} data
 */
function embedVideo(data) {
    var video = 'https://www.youtube.com/embed/' + data.items[0].id.videoId
    displayVideo(video, 'videoModal')
}

/**
 * @description Takes a HTML element and sets it's visibility to 'visible'
 * @param {id} elmnt
 */
function makeVisible(elmnt) {
    document.getElementById(elmnt).style.visibility = 'visible'
}

/**
 * @description Takes a HTML element and sets it's visibility to 'hidden'
 * @param {HTMLDivElement} elmnt 
 */
function makeInvisible(elmnt) {
    x = document.getElementById(elmnt).style.visibility = 'hidden'
}

/**
 * @description Takes an iFrame and modalName and places the iFrame in the
 *              required modal. The modal view is also controlled by this function.
 * @param {HTMLIFrameElement} data 
 * @param {id} modalName 
 */
function displayVideo(data, modalName) {
    document.getElementsByClassName('showPlayer')[0].style.visibility = 'hidden'
    // Get the modal
    var modal = document.getElementById(modalName);

    if (data === undefined) {
    } else {
        document.getElementById(modalName).childNodes[1].childNodes[3].innerHTML = "<iframe align='center' width='560' height='385' src=" + data + "></iframe>";
    }
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[1];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
        document.getElementsByClassName('showPlayer')[0].style.visibility = 'visible'
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.getElementsByClassName('showPlayer')[0].style.visibility = 'visible'
        }
    }
}

/**
 * @description Shows the player modal.
 */
function showPlayer() {
    displayVideo(undefined, 'videoModal')
}

/**
 * @description Displays the selected song lyrics in a modal box.
 * @param {String} data 
 * @param {id} modalName
 */
function displayLyrics(data, modalName) {
    // Get the modal
    var modal = document.getElementById(modalName);
    document.getElementById(modalName).childNodes[1].childNodes[3].innerHTML = data
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

/**
 * @description Listen for the 'enter' key being pressed and click search if
 *              it is.
 */
function enterToSearch() {
    var input = document.getElementById("SearchBox");
    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the search button element with a click
            document.getElementsByClassName("searchButton")[0].click();
        }
    });
}

/**
 * @description Once the page has loaded, click the default page tab,
 *              Run the Explore page search so that the page is populated,
 *              Select the search box as the page focus and
 *              Hide the Player icon.
 *              Run the enterToSearch() function to listen for the enter
 *              key and run the search.
 */
window.addEventListener('load', function () {
    document.getElementById("defaultOpen").click();
    document.getElementsByClassName('searchButton')[1].click();
    document.getElementById('SearchBox').focus();
    document.getElementsByClassName('showPlayer')[0].style.visibility = 'hidden'
    enterToSearch()
})