/** Helper function for the character pickers. */
function getRandomChars(num, charset) {
    // Pick num random bytes
    let array = new Uint8Array(num);
    window.crypto.getRandomValues(array);
    let kray = new Array(num);
    for (let i=0; i < array.length; i++) {
        // Convert each random byte to a random idx with a max of charset.length-1
        let idx = Math.floor(array[i] * Math.pow(2,-8) * charset.length);
        // Add the char at this idx to kray
        kray[i] = charset.charAt(idx);
    }

    // return as one string
    return kray.join('');
}

/** Get upper letters. */
function getUpper(num) {
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return getRandomChars(num, upper);
}

function getLower(num) {
    var lower = 'abcdefghijklmnopqrstuvwxyz';
    return getRandomChars(num, lower);
}

function getNum(num) {
    let numbers = '0123456789';
    return getRandomChars(num, numbers);
}

function getSymbol(num) {
    let symbols = '~!@#$%^&*()-_=+[]{};:<>?,.';

    // if we don't escape, this could mess up the html we print later
    return escapeHtml(getRandomChars(num, symbols));
}

/** Write the password to the page. */
function writePassword(something) {
    document.getElementById("demo").innerHTML = something;
}

/** Shuffle an array using some algorithm. */
function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

/**
 * Symbols need escaping so they don't mess up the HTML. This is invisible to the generated code
 * in the browser, at least in Firefox.
 */
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

/** Main function. */
function genPassword() {
    const functionArray = [getUpper, getLower, getNum, getSymbol];
    const PASSWORD_MIN_LENGTH = 4;
    let numPieces =  document.getElementById("quantity").value;
    let wordLength = document.getElementById('wlength').value;
    let radioButtons = document.querySelectorAll('input[name="readability"]');
    for (const rb of radioButtons) {
        if (rb.checked) {
            let readabilityStr = rb.value;
            var readability = (readabilityStr === "true");
            break;
        }
    }

    // Initial part of password requires all 4 parts in functionArray
    var functionOrder = shuffle(functionArray);

    // Extend array out to numPieces
    var extendedLength = numPieces - PASSWORD_MIN_LENGTH;
    if (extendedLength > 0) {
        // Get array of random bytes
        let extendedRandoms = new Uint8Array(extendedLength);
        window.crypto.getRandomValues(extendedRandoms);
        let kray = new Array(extendedLength);
        for (let i=0; i<extendedRandoms.length; i++) {
            // Convert each byte to a function
            let idx = Math.floor(extendedRandoms[i] * Math.pow(2,-8) * functionArray.length);
            kray[i] = functionArray[idx];
        }

        // New functionOrder contains randomly selected functions
        functionOrder = functionOrder.concat(kray);
    }

    var dubs = new Array(functionOrder.length);
    for (let i=0; i<functionOrder.length; i++ ) {
        dubs[i] = functionOrder[i](wordLength);
    }

    if (readability) {
        writePassword(dubs.join('<font size="+2px">-</font>'));
    } else {
        writePassword(dubs.join(''))
    }
}