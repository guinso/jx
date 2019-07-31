/** 
 * =============================================================
 * polyfills for string 
 * =============================================================
 */

function stringPolyfill() {
    String.prototype.contains = String.prototype.contains || function(str) {
        return this.indexOf(str) >= 0;
    };
    
    String.prototype.startsWith = String.prototype.startsWith || function(prefix) {
        return this.indexOf(prefix) === 0;
    };
    
    String.prototype.endsWith = String.prototype.endsWith || function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) >= 0;
    };
};

module.exports = stringPolyfill;