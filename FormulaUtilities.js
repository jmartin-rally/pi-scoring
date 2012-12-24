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
			name_array = this.formula.split(/\W/);
			// check for one-sided =
			if ( name_array[name_array.length - 1] == '' ) { 
				name_array.pop(); 
			}
			if ( name_array[0] == '' ) {
				name_array = [];
			}
			// force to an array
			if ( typeof(name_array) === "string" ) { name_array = [ name_array ]; }
		}
		return name_array;
	};
	
	this.getParsedFormula = function( record ) {
		var result = null;
		var field_names = this.getFieldNames();
		if ( field_names && field_names.length > 1 ) {
			result = this.formula.replace(/.*=/,"");
			for ( var i=0;i<field_names.length;i++ ) {
				var field_name = field_names[i];
				if ( record[field_name] !== null && typeof(record[field_name]) !== "undefined" ) {
					var value = record[field_name];
					if ( typeof(value) == "string" ) { value = 0; }
					result = result.replace( field_name, value );
				} else {
					// not really a field name
					if ( typeof( parseFloat( field_name, 10 )) == "float" ) { value = field_name; }
				}
			}
		}
		return result;
	};
	
	this.calculate = function( record ) {
		var parsed_formula = this.getParsedFormula(record);
		
		var value = null;
		try {
			var value = eval(parsed_formula);
		} catch(e) {
			console.log( "Couldn't evaluate ", parsed_formula, " (", e.message, ")");
		}
		return value;
	};
	// -- START HERE --
	this.formula = null;
	this.setFormula(formula);
}