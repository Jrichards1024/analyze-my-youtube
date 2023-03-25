/**
 * 	Functions for explode-the-web (keeping the tutorial simple)
 */



// ************** UI STATES **************

// track time to count down until explosion
let timeUntilExplode = 0;
// whether to explode or not
let explodePaused = false;
// to control / reset interval
let intervalObj;



// ************** EVENT LISTENERS **************

// if the user clicks on the element
$(document).on('click', '.explode-notification', function() {
    // and display the list
    $('.explode-tracker-list').toggle();
});



// ************** TIMER FUNCTIONS **************

function startExplosionCountdown(duration = 10) {
    // set explosion timer duration
    timeUntilExplode = duration;
    // start timer
    intervalObj = setInterval(updateTimer, 1000);
    // add explosion image
    $('.explode-counter').css({
        "background": "url(" + chrome.runtime.getURL("assets/img/explosion-ui.svg") + ")",
        "cursor": "pointer"
    });
    // add click listener if user wants to cancel
    $(document).on('click', '.explode-counter', function() {
        // if time left
        if (timeUntilExplode > 0) {
            // and explode isn't already paused
            if (!explodePaused) {
                // set it paused
                explodePaused = true;
                // clear timer
                clearInterval(intervalObj);
                // update title
                displayExplodeTitleHtml("Click to start timer");
            } else {
                // set it not paused
                explodePaused = false;
                // start timer
                intervalObj = setInterval(updateTimer, 1000);
                // update title
                displayExplodeTitleHtml("Click to cancel");
            }
        } else {
            // reload page
            location.reload();
        }
    });
}
// function called every second from setInterval()
function updateTimer() {
    // if time is left
    if (timeUntilExplode > 0) {
        // subtract by 1
        timeUntilExplode--;
        // display result in browser
        $('.explode-counter-text').html(DOMPurify.sanitize(String(timeUntilExplode)));
        // update title text
        displayExplodeTitleHtml("Click to cancel");
    }
    // if no time is left
    else {
        // clear interval and explode page
        clearInterval(intervalObj);
        // explode the page
        explodeThePage();
        // update title text
        displayExplodeTitleHtml("Click reset to reset page");
    }
}



// ************** DATA MANIPULATION **************

/**
 *  Return array of scripts.src that match disconnect trackers
 */
function getTrackersFound(scriptsFoundArr) {

    // trackers found
    var trackersFoundArr = [];
    // loop through scripts
    for (var i = 0, l = scriptsFoundArr.length; i < l; i++) {
        // if script tag has no src attribute then skip
        if (scriptsFoundArr[i].src === "") continue;
        // get root domain of scripts src
        var scriptDomain = extractRootDomain(scriptsFoundArr[i].src);
        // look to see if tracker root domain is in disconnectTrackingServices
        if (disconnectTrackingServices.indexOf(scriptDomain) >= 0) {
            console.log("👀 getTrackers()", scriptDomain);
            // add to found list
            trackersFoundArr.push(scriptDomain);
        }
    }
    return trackersFoundArr;
}

// display graphic with explosion countdown




/**
 *	Display tracker list / button
 */
function displayTrackerList(trackersFoundArr) {
    let str = `
    <div class='explode-wrapper'>
        <div class='explode-notification' title='click to see trackers on this page'>
            <span class='explode-number'>${trackersFoundArr.length}</span>
            <span class='explode-text'>tracker(s)</span>
        </div>

        <div class='explode-tracker-list'>${trackersFoundArr.join("<br>")}</div>
        <div class='explode-counter'>
            <div class='explode-counter-text'></div>
        </div>
    </div>
    `;
    // append html to loaded web page
    $('body').append(DOMPurify.sanitize(str));
}
// change title attribute text
function displayExplodeTitleHtml(status) {
    let attr = "this page will explode in [" + timeUntilExplode + "] seconds. " + status;
    $('.explode-counter').attr('title', DOMPurify.sanitize(attr));
}



// ************** STRING FUNCTIONS **************


/**
 *	Return entire name from URL
 */
function extractHostname(url) {
    //console.log("extractHostname()",url);
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    //console.log("extractHostname() hostname =",hostname);
    return hostname;
}

/**
 *	Return just the domain and TLD name
 */
function extractRootDomain(url) {
    //console.log("extractRootDomain()",url);
    if (url == "") return "";
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    //console.log("extractRootDomain() domain =",domain);
    return domain;
}
