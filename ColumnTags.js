/**
 * A Column definition class which renders Rally Tags.  See the {@link Ext.grid.column.Column#xtype xtype}
 * config option of {@link Ext.grid.column.Column} for more details.
 *
 */
Ext.define('Ext.grid.column.Tags', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.tagscolumn'],
    alternateClassName: 'Ext.grid.TagsColumn',

    /**
     * @cfg {String} undefinedText
     * The string returned by the renderer when the column value is undefined.
     */
    undefinedText: '&#160;',

    /**
     * @cfg renderer
     * @hide
     */
    /**
     * @cfg scope
     * @hide
     */

    defaultRenderer: function(value){
        if (value === undefined) {
            return this.undefinedText;
        }
        
        if ( typeof(value) !== "object" ) {
        	return this.undefinedText;
        }
        
        if ( value.length < 1 ) {
        	return this.undefinedText;
        }
        
        if ( value.length > 0 ) {
        	var result_array = [];
        	for ( var i=0; i<value.length; i++ ) {
        		result_array.push(value[i].Name);
        	}
        	return result_array.join( ", " );
        }

        return "?";
    }
});