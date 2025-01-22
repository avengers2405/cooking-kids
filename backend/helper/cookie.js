

function cookieParser(cookieString) {
    if (cookieString === "")
        return {};
    let pairs = cookieString.split(";");

    // Separate keys from values in each pair string
    // Returns a new array which looks like
    // [[key1,value1], [key2,value2], ...]
    let splittedPairs = pairs.map(cookie => cookie.split("="));
    const cookieObj = splittedPairs.reduce(function (obj, cookie) {

        // cookie[0] is the key of cookie
        // cookie[1] is the value of the cookie 
        // decodeURIComponent() decodes the cookie 
        // string, to handle cookies with special
        // characters, e.g. '$'.
        // string.trim() trims the blank spaces 
        // auround the key and value.
        if (cookie.length<2) return obj;
        // console.log('inside func: ', cookie);
        obj[decodeURIComponent(cookie[0].trim())]
            = decodeURIComponent(cookie[1].trim());

        return obj;
    }, {});

    return cookieObj;
}

export default cookieParser;