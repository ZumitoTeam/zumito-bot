const {default: localizify, t} = require('localizify');         // Load localization library

module.exports = {
    splitCommandLine( commandLine ) {

        //log( 'commandLine', commandLine ) ;
    
        //  Find a unique marker for the space character.
        //  Start with '<SP>' and repeatedly append '@' if necessary to make it unique.
        var spaceMarker = '<SP>' ;
        while( commandLine.indexOf( spaceMarker ) > -1 ) spaceMarker += '@' ;
    
        //  Protect double-quoted strings.
        //   o  Find strings of non-double-quotes, wrapped in double-quotes.
        //   o  The final double-quote is optional to allow for an unterminated string.
        //   o  Replace each double-quoted-string with what's inside the qouble-quotes,
        //      after each space character has been replaced with the space-marker above.
        //   o  The outer double-quotes will not be present.
        var noSpacesInQuotes = commandLine.replace( /"([^"]*)"?/g, ( fullMatch, capture ) => {
            return capture.replace( / /g, spaceMarker ) ;
        }) ;
    
    
        //  Now that it is safe to do so, split the command-line at one-or-more spaces.
        var mangledParamArray = noSpacesInQuotes.split( / +/ ) ;
    
    
        //  Create a new array by restoring spaces from any space-markers.
        var paramArray = mangledParamArray.map( ( mangledParam ) => {
            return mangledParam.replace( RegExp( spaceMarker, 'g' ), ' ' ) ;
        });
    
    
        return paramArray ;
    },
}