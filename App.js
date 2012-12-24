/*global console, Ext */
Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [ 
        { xtype: 'container', itemId: 'picker_row', defaults: { padding: 5},  layout: { type: 'hbox' }, items: [
	        { xtype: 'container', itemId: 'type_picker_box' },
	        { xtype: 'container', itemId: 'column_picker_box' },
            { xtype: 'container', itemId: 'calculator_box' }
        ]},
        { xtype: 'container', itemId: 'pi_grid_box', padding: 5 }
    ],
    /*minimum_columns: [ {text: "ID", dataIndex: "FormattedID"}, {text: "Name", dataIndex: "Name", editor: { xtype: "rallytextfield", width: 250 }, flex: 1 } ], */
    minimum_columns: [ {text: "ID", dataIndex: "FormattedID"}, {text: "Name", dataIndex: "Name", flex: 1 } ],
    additional_columns: [],
    calculation_fields: [],
    type: null,
    formula_utilities: new FormulaUtilities(),
    launch: function() {
        console.log("Settings", this.settings );
        this.wait = new Ext.LoadMask( this, {msg: "Loading data..." } );
        this._addCalculator();
        this._addFieldPicker();
        this._addTypePicker();
    },
    _addCalculator: function() {
        var calculator_dialog = Ext.create('PXS.ui.dialog.FormulaDialog', {
            width: 400,
            title: 'Calculator',
            app: this,
            listeners: {
                afterformulasave: function(formula) {
                    var that = this;
                    this.formula_utilities.setFormula(formula);
                    if ( this.calculation_fields !== this.formula_utilities.getFieldNames() ) {
                        this.calculation_fields = this.formula_utilities.getFieldNames();
                    }
                    if ( this.calculation_fields.length > 0 ) {
	                    var target_field = this.calculation_fields[0];
                        this.wait.show();
				        this.pi_store = Ext.create('Rally.data.WsapiDataStore', {
				            autoLoad: true,
				            model: that.type,
				            listeners: {
				                load: function(store,data,success) {
                                    that._showGrid();
				                    Ext.Array.each( data, function(record) {
                                        var newValue = that.formula_utilities.calculate(record.getData());
	                                    record.set(target_field, newValue );
                                        record.save();
				                    });
				                },
				                scope: this
				            },
				            fetch: that._getFetchFields()
				        });
                    }
                    
                },
                scope: this
            }
        });

        var calculator = Ext.create('Rally.ui.Button', {
            text: 'Define Calculator',
            listeners: {
                click: function( button, event, options ) {
                    calculator_dialog.show();
                }
            }
        });
        this.down('#calculator_box').add(calculator);
    },
    _addFieldPicker: function() {
        var that = this;
        var picker = Ext.create('Rally.ui.picker.FieldPicker', {
            modelType: "PortfolioItem",
            fieldLabel: "Columns",
            labelSeparator: "",
            labelWidth: 45,
            labelPad: 5,
            labelCls: "rui-label",
            stateEvents: ['selectionchange' ],
            stateful: true,
            stateId: 'pi-score-columns',
            fieldWhiteList: ["ActualStartDate", "ActualEndDate", "PlannedStartDate", "PlannedEndDate", "PercentDoneByStoryCount", "PercentDoneByStoryPlanEstimate", "InvestmentCategory","RiskScore", "ValueScore"],
            listeners: {
                change: function(picker, newValue, oldValue ) {
                    console.log( "change", picker.getValue, newValue );
                },
                selectionchange: function( picker, values, options ) {
                    console.log( "selectionchange", picker.getValue(), values );
                    that._setAdditionalColumns(values);
                    that._getPortfolioItems();
                }
            },
            getState: function() {
                return { value: this.getValue() };
            },
            applyState: function(state) {
                that._setAdditionalColumns(state.value);
                this.setValue(state.value);
            }
        });  
        this.down('#column_picker_box').add(picker);
    },
    _setAdditionalColumns: function( values ) {
        var that = this;
        that.additional_columns = [];
        Ext.Array.each( values, function(value) {
            that.additional_columns.push( {text: value.displayName, dataIndex: value.name});
        });
        return true;
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
        this.wait.show();
    	this.pi_store = Ext.create('Rally.data.WsapiDataStore', {
    		autoLoad: true,
    		model: that.type,
    		listeners: {
    			load: function(store,data,success) {
    				this._showGrid();
    			},
    			scope: this
    		},
    		fetch: that._getFetchFields()
    	});
    },
    _getFetchFields: function() {
        var fields = [];
        var cols = Ext.Array.merge( this.minimum_columns, this.additional_columns );
        Ext.Array.each( cols, function( col ) {
            fields.push( col.dataIndex );
        });
        console.log( fields );
        fields = Ext.Array.merge( fields, this.calculation_fields );
        return fields;
        
    },
    _showGrid: function() {
    	console.log( "_showGrid");
    	var that = this;
        this.wait.show();
    	if ( this.pi_grid ) { this.pi_grid.destroy(); }
    	this.pi_grid = Ext.create('Rally.ui.grid.Grid', {
    		store: that.pi_store,
            model: 'PortfolioItem/Feature',
            enableEditing: true,
            plugins: Ext.create( 'Rally.ui.grid.plugin.CellEditing', {}),
                
    		columnCfgs:  Ext.Array.merge( that.minimum_columns, that.additional_columns )
    	});
    	this.down('#pi_grid_box').add(this.pi_grid);
        this.wait.hide();
//        var records = this.pi_store.getRecords();
//        Ext.Array.each( records, function(record) { 
//            record.set("RiskScore", 6);
//            record.save();
//        });
      
    }
});
