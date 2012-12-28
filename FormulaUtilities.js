/*
 * DEFINE some functions that can be used in the formulas
 * 
 */

var hasTag = function( tag_name ) {
	var result = false;
	if ( record_under_test.Tags ) {
		for ( var i=0; i< record_under_test.Tags.length; i++ ) {
			if ( record_under_test.Tags[i].Name == tag_name ) {
				result = true;
			}
		}
	}
	return result;
};

var applyMap = function( variable, hash ) {
	var result = hash['Default'] || hash['default'] || 0;
	if ( record_under_test[variable] ) {
		var content = record_under_test[variable];
		window.console && console.log( "..record has field", variable, "=", content);

		content = content.replace(/ /g,"%20");
		
		window.console && console.log( "...looking in the hash for ", content);
		if ( hash.hasOwnProperty( content )) {
			window.console && console.log( "..and the value is in the hash", hash[content]);
			result = hash[content];
		}
	}
	return result;
}

var record_under_test = null;

/*
 * utilities for interacting with via writing a formula
 * 
 */
var FormulaUtilities = function(formula) {
	
	this.setFormula = function(formula) {
		if ( formula && formula !== null ) {
			formula = formula.replace(/\s/g,"");
			if ( this.formula === "" ) { 
				formula = null; 
			} else if ( formula.replace( /\W/g,"" ) === "" ) { 
				formula = null; 
			} 
		} else {
			formula = null;
		}
		this.formula = formula;
	};
	
	this.getFieldNames = function() {
		var name_array = [];
		
		if ( this.formula !== null ) {
			name_array = this.formula.split(/[\W]/);
		}
		return cleanArray(name_array);
	};
	
	/* 
	 * need to get fields differently than fields that are fetched 
	 * so that replacement works well.
	 */
	this.getFieldReplacementNames = function() {
		var name_array = [];
		if ( this.formula !== null ) {
			name_array = this.formula.split(/[^\w|\.]/);
		}
		return cleanArray(name_array);
	};
	
	this.getParsedFormula = function( record ) {
		var result = null;
		record_under_test = record;
		var field_names = this.getFieldReplacementNames();
		if ( field_names && field_names.length > 1 ) {
			result = this.formula.replace(/.+?=/,"");
			for ( var i=1;i<field_names.length;i++ ) {
				var field_name = field_names[i];
				if ( record[field_name] !== null && typeof(record[field_name]) !== "undefined" ) {
					var value = record[field_name];
					if ( typeof(value) == "string" ) { value = 0; }
					var re = new RegExp(field_name + "(?!')");
					result = result.replace( re, value );
				} else if ( /\./.test(field_name) ) {
					var nested_value = this.getNestedValue( field_name );
					var value = 0;

					result = result.replace( field_name, nested_value );
				} else  {
					// not really a field name
					if ( typeof( parseFloat( field_name, 10 )) == "float" ) { value = field_name; }
				}
			}
		}
		return result;
	};
	
	this.getNestedValue = function(name) {
		var field_array = name.split(/\./);
		var field_statement = "record_under_test['" + field_array.join("']['") + "']";
		var value = "";

		if ( typeof(record_under_test[field_array[0]]) == "string" ) {
			value = '"' + record_under_test[field_array.shift()] + '".' + field_array.join(".") ;
			console.log("I'm a string!", field_statement);
		}
		
		if ( value === "" ) {	
			try {
				window.console && console.log( "evaluating", field_statement);
				value = eval( field_statement ) || 0;
			} catch(e) {
				window.console &&  console.log( "Using a '' because evaluating gave: " + e.message + " (" + field_statement + ")");
			}
		}
		
		return value;
	};
	
	this.calculate = function( record ) {
		var parsed_formula = this.getParsedFormula(record);
		window.console && console.log( "Parsed Formula:", parsed_formula);
		var value = null;
		try {
			var value = eval(parsed_formula);
		} catch(e) {
			window.console && console.log( "Returning null because couldn't evaluate ", parsed_formula, " (", e.message, ")");
		}
		return value;
	};
	
	var cleanArray = function( an_array ) {
		var name_array = [];
		// check for one-sided =
		if ( an_array[name_array.length - 1] == '' ) { 
			an_array.pop(); 
		}
		if ( an_array[0] == '' ) {
			an_array = [];
		}
		// force to an array
		if ( typeof(an_array) === "string" ) { an_array = [ an_array ]; }
		
		for ( var i=0; i<an_array.length; i++ ) {
			var item = an_array[i];
			if ( item === "hasTag" ) {
				item = "Tags";
			}
			if ( /['|"]/.test(item) ) {
				item = '';
			}
			if ( item !== '' ) {
				name_array.push(item);
			}
		}
		
		return name_array;
	};
	// -- START HERE --
	this.formula = null;
	this.setFormula(formula);
}