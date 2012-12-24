describe("ParserCalculateTests", function() {

	beforeEach( function() { 
		parser = new FormulaUtilities();
		simple_object = {
			int_field:10,
			int_field2:20,
			zero_field:0,
			int_string_field: "10",
			float_field: 1.5,
			string_field: "I'm a string"
		};
	});
	
	it("should return null if no fields", function() {
		parser.setFormula(" ");
		expect( parser.getParsedFormula( simple_object )).toEqual(null);
		
		parser.setFormula("newField=");
		expect( parser.getParsedFormula(simple_object)).toEqual(null);
		expect( parser.calculate(simple_object)).toEqual(null);
	});
	
    it("should return one field's value", function() {
    	parser.setFormula("newField = int_field" );
    	expect( parser.getParsedFormula( simple_object )).toEqual("10");
    	
    	parser.setFormula("newField = float_field");
    	expect(parser.getParsedFormula(simple_object)).toEqual("1.5");
    	expect(parser.calculate(simple_object)).toEqual(1.5);
    	
    	parser.setFormula("newField = string_field");
    	expect(parser.getParsedFormula(simple_object)).toEqual("0");
    	
    	parser.setFormula("newField = non_existent_field");
    	expect(parser.getParsedFormula(simple_object)).toEqual("non_existent_field");
    	expect(parser.calculate(simple_object)).toEqual(null);

    	parser.setFormula("newField = 10");
    	expect(parser.getParsedFormula(simple_object)).toEqual("10");
    	expect(parser.calculate(simple_object)).toEqual(10);
    	
       	parser.setFormula("newField = zero_field");
    	expect(parser.getParsedFormula(simple_object)).toEqual("0");
    	expect(parser.calculate(simple_object)).toEqual(0);
    });
    
    it("should return value for simple equations", function() {
    	parser.setFormula( "newField = int_field + float_field" );
    	expect( parser.getParsedFormula(simple_object)).toEqual( "10+1.5");
    	expect(parser.calculate(simple_object)).toEqual(11.5); 
    	
    	parser.setFormula( "newField = int_field * float_field" );
    	expect(parser.calculate(simple_object)).toEqual(15);
    	
    	parser.setFormula( "newField = int_field * 2" );
    	expect(parser.calculate(simple_object)).toEqual( 20 );
    	
    	parser.setFormula( "newField = int_field + int_field2" );
    	expect(parser.calculate(simple_object)).toEqual(30);
    });
    
    it("should return value for complicated equations", function(){
    	parser.setFormula( "newField = int_field + int_field" );
    	expect(parser.calculate(simple_object)).toEqual(20);
    	
    	parser.setFormula( "newField = ( int_field * 3 ) / ( 2 * float_field )" );
    	expect(parser.calculate(simple_object)).toEqual(10);
    	
    	parser.setFormula( "newField = ( int_field + int_field2 ) + ( int_field2 + int_field )" );
    	expect(parser.calculate(simple_object)).toEqual(60);
    	
    });
});
