/*global console, Ext */
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [ 
        { xtype: 'container', itemId: 'picker_row', padding: 5, layout: { type: 'hbox' }, items: [
	        { xtype: 'container', itemId: 'type_picker_box' },
	        { xtype: 'container', itemId: 'column_picker_box' }
        ]},
        { xtype: 'container', itemId: 'pi_grid_box', padding: 5 }
    ],
    minimum_display_fields: [ 'FormattedID', 'Name' ],
    additional_display_fields: [ 'RiskScore' ],
    calculation_fields: [],
    type: null,
    launch: function() {
        //Write app code here
        this._addTypePicker();
    },
    _addTypePicker: function() {
        var picker = Ext.create('Rally.ui.combobox.PortfolioItemTypeComboBox', {
            listeners: { 
               scope: this, 
               change: function(picker,newValue,oldValue) {
                    this.type = picker.getRecord().getData().TypePath;
                    this._getPortfolioItems();
               }
            } 
        });
        this.down('#type_picker_box').add(picker);
    },
    _getPortfolioItems: function() {
    	console.log( "_getPortfolioItems" );
        var that = this;
    	this.pi_store = Ext.create('Rally.data.WsapiDataStore', {
    		autoLoad: true,
    		model: that.type,
    		listeners: {
    			load: function(store,data,success) {
    				this._showGrid();
    			},
    			scope: this
    		},
    		fetch: Ext.Array.merge( that.minimum_display_fields, that.additional_display_fields, that.calculation_fields )
    	});
    },
    _showGrid: function() {
    	console.log( "_showGrid");
    	var that = this;
    	if ( this.pi_grid ) { this.pi_grid.destroy(); }
    	this.pi_grid = Ext.create('Rally.ui.grid.Grid', {
    		store: that.pi_store,
            model: 'PortfolioItem/Feature',
    		columnCfgs:  [
                {text: "ID", dataIndex: "FormattedID"},
                {text: "Name", dataIndex: "Name", flex: 1 },
                {text: "Risk", dataIndex: "RiskScore" }
                ]
    	});
    	this.down('#pi_grid_box').add(this.pi_grid);
//        var records = this.pi_store.getRecords();
//        Ext.Array.each( records, function(record) { 
//            record.set("RiskScore", 6);
//            record.save();
//        });
      
    }
});
