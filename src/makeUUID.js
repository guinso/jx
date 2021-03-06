/**
 * @module jx
 */

/**
 * Create UUID <br/>
 * Source: stackoverflow<br/>
 * URL: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 * 
 * @public
 */
function makeUUID() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

module.exports = makeUUID;