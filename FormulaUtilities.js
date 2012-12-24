// for using during evaluation
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

var record_under_test = null;

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
			result = this.formula.replace(/.*=/,"");
			for ( var i=1;i<field_names.length;i++ ) {
				var field_name = field_names[i];
				if ( record[field_name] !== null && typeof(record[field_name]) !== "undefined" ) {
					var value = record[field_name];
					if ( typeof(value) == "string" ) { value = 0; }
					var re = new RegExp(field_name + "(?!')");
					result = result.replace( re, value );
				} else if ( /\./.test(field_name) ) {
					var nested_name = this.getNestedFieldName( field_name );
					var value = 0;
					try {
						value = eval( "record" + nested_name ) || 0;
					} catch(e) {
						window.console &&  console.log( "Using a 0 because evaluating gave: " + e.message + " (" + nested_name + ")");
					}
						
					result = result.replace( field_name, value );
				} else  {
					// not really a field name
					if ( typeof( parseFloat( field_name, 10 )) == "float" ) { value = field_name; }
				}
			}
		}
		return result;
	};
	
	this.getNestedFieldName = function(name) {
		var field_array = name.split(/\./);
		var field_name = "['" + field_array.join("']['") + "']";
		
		return field_name;
	};
	
	this.calculate = function( record ) {
		var parsed_formula = this.getParsedFormula(record);
		
		var value = null;
		try {
			var value = eval(parsed_formula);
		} catch(e) {
			window.console && console.log( "Couldn't evaluate ", parsed_formula, " (", e.message, ")");
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