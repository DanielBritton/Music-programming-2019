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
}

function validateSearch() {
    inputVal = document.getElementById("inputVal").value
    console.log(inputVal)
    if (inputVal.length == 0) {
        makeVisible('error')
    } else {
        makeInvisible('error')
        data = searchByTrackName(inputVal);

        document.getElementById('basicResults').innerHTML = data
        document.getElementById('searchResults').style.visibility = 'visible'
    }
}

function searchByTrackName(query) {
    request = ("https://api.musixmatch.com/ws/1.1/track.search?format=jsonp&q_track=" + query + "&apikey=802224f7ee4779fbc74a6ebaf2347221")
    //callback=jsonpcallback& //before q_track
    // $.ajax({
    //     type: "GET", url: request,
    //     success: function (data) {
    //         console.log(data)
    //         return data;
    //     }
    // })
    fetch(request).then(data => {
        console.log(data.json())
    })
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

