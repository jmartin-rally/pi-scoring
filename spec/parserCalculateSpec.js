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
		
		object_with_tags = {
				int_field:10,
				Tags: [ { Name: "tubby" }, { Name: "grendel" } ]
		};
		
		object_with_parent = {
				int_field: 10,
				other_field: 20,
				Parent: { int_field: 5 }
		};
		
		
		
		object_with_deep_parentage = {
				other_field: 10,
				Parent: {
					int_field: 5,
					Parent: {
						int_field: 2,
						Parent: {
							int_field: 1
						}
					}
				}
		}
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
    
    it("should return a value for hasTag() ", function() {
    	parser.setFormula( 'newField = hasTag( "grendel" )' );
    	expect(parser.getParsedFormula(object_with_tags)).toEqual('hasTag("grendel")');
    	expect(parser.calculate(object_with_tags)).toEqual( true );
    	
    	parser.setFormula( 'newField = hasTag( "bubble" )');
    	expect(parser.calculate(object_with_tags)).toEqual(false);
    	
    	parser.setFormula( 'newField = hasTag( "bubble" )');
    	expect(parser.calculate(object_with_tags)).toEqual(false);
    	
    	expect(parser.calculate(simple_object)).toEqual(false);
    	
    	parser.setFormula( 'newField = hasTag( "grendel" ) ? 1:0 ');
    	expect(parser.calculate(simple_object)).toEqual(0);
    	expect(parser.calculate(object_with_tags)).toEqual(1);
    	
    	parser.setFormula( 'newField = ( hasTag("grendel") ? 1:0 ) * int_field');
    	expect(parser.calculate(simple_object)).toEqual(0);
    	expect(parser.calculate(object_with_tags)).toEqual(10);
	});
    
    it("should return a value when using related records", function() {
    	parser.setFormula( 'newField = Parent.int_field');
    	expect(parser.calculate(object_with_parent)).toEqual(5);
    	
    	parser.setFormula( 'newField = Parent.int_field + other_field');
    	expect(parser.calculate(object_with_parent)).toEqual(25);
    	
    	parser.setFormula( 'newField = Parent.Parent.Parent.int_field + other_field');
    	expect(parser.calculate(object_with_deep_parentage)).toEqual(11);
    });
    
    it("should return a value when using related records even if related record does not exist", function() {
    	parser.setFormula( 'newField = Parent.int_field + float_field');
    	expect(parser.calculate(simple_object)).toEqual(1.5);    	
    });

    it("should not matter order of fields when using related records", function() {
    	parser.setFormula( 'newField = Parent.int_field + int_field');
    	expect(parser.calculate(object_with_parent)).toEqual(15);
    	
    	parser.setFormula( 'newField = int_field + Parent.int_field');
    	expect(parser.calculate(object_with_parent)).toEqual(15);
    });
    
    it("should allow JavaScript replace method on strings", function() {
    	parser.setFormula("newField = Priority.replace('a','')");
    	var test_object = { Priority: "abc" };
    	expect(parser.calculate(test_object)).toEqual("bc");
    	
    	test_object.Priority = "P1";
    	parser.setFormula("newField = Priority.replace('P','') * 5")
    	expect(parser.calculate(test_object)).toEqual(5)
	});
    
    it("should not fail when JS replace method on missing field", function() {
    	parser.setFormula("newField = NotAField.replace('a','')");
    	expect(parser.calculate(object_with_parent)).toEqual('');
    	
    	parser.setFormula("newField = ( NotAField.replace('a','') || 0 ) * 1 ");
    	expect(parser.calculate(object_with_parent)).toEqual(0);
    });
});
