describe("ParserBasicTests", function() {

	beforeEach( function() { parser = new FormulaUtilities(); } );
	
    it("should return empty array of fields for empty or unbalanced formula", function() {
    	expect( parser.getFieldNames() ).toEqual([]);
    	parser.setFormula(null);
    	expect( parser.getFieldNames() ).toEqual([]);
    	parser.setFormula("");
    	expect( parser.getFieldNames() ).toEqual([]);
    	parser.setFormula("  ");
    	expect( parser.getFieldNames() ).toEqual([]);
    	parser.setFormula(" = "); 
    	expect( parser.getFieldNames() ).toEqual([]);
    	parser.setFormula(" = fieldA");
    	expect( parser.getFieldNames()).toEqual([]);
    });
    
    it('should get field names for simple formula', function() {
    	parser.setFormula("fieldA" );
    	expect( parser.getFieldNames()).toEqual(["fieldA"]);

    	parser.setFormula("fieldA=" );
    	expect( parser.getFieldNames()).toEqual(["fieldA"]);
    	
    	parser.setFormula( "fieldA = fieldB" );
    	expect( parser.getFieldNames()).toEqual(["fieldA","fieldB"]);
    	parser.setFormula( "fieldA=fieldB" );
    	expect( parser.getFieldNames()).toEqual(["fieldA","fieldB"]);
    	parser.setFormula( " fieldA =fieldB " );
    	expect( parser.getFieldNames()).toEqual(["fieldA","fieldB"]);
    });
    
    it('should get field names for longer formula', function() {
    	parser.setFormula( "fieldA = fieldB + fieldC - fieldD");
    	expect(parser.getFieldNames()).toEqual(["fieldA","fieldB","fieldC","fieldD"]);
    	parser.setFormula( "fieldA = fieldB/fieldC" );
    	expect(parser.getFieldNames()).toEqual(["fieldA","fieldB","fieldC"]);
    });
    
    it('should give Tags as a field name if hasTag is invoked', function() {
    	parser.setFormula( "fieldA = hasTag('grendel') " );
    	expect(parser.getFieldNames()).toEqual(["fieldA", "Tags", "grendel"]);
    	
    });
    
});
