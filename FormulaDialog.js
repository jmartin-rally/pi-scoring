Ext.define( 'PXS.ui.dialog.FormulaDialog', {
	extend: 'Rally.ui.dialog.Dialog',
	requires: [ 'Rally.ui.Button' ],
	closable: false,
	stateful: false,
	formula: null,
	config: {
		
	},
	constructor: function(config) {
		this.mergeConfig(config);
		this.callParent(arguments);
		
		this.addHeader();
		this.addEditor();
		this.addFooter();
	},
	initComponent: function() {
		window.dialog = this;
		this.callParent(arguments);
		this.addEvents([
            /**
             * @event
             * Fired before saving the formula.
             * @param formula the formula being saved.  Return false to prevent saving.
             */
             'beforeformulasave'
        ]);
	},
	addHeader: function() {
		this.add( {
            xtype: 'component',
            html: 'To calculate a value for the items in the grid, enter a formula below.<br/><br/>' +
                    'Use the format FieldName = FieldA + FieldB',
            padding: 10
        } );
	},
	addEditor: function() {
		this.add({
                padding: 10,
                xtype: 'rallytextfield',
                fieldLabel: 'Formula',
                width: 250,
                labelAlign: "top",
	            labelPad: 5,
	            labelCls: "rui-label",
                itemId: 'formula_box'
        });
	},
	addFooter: function() {
		this.addDocked({
            xtype: 'toolbar',
            dock: 'bottom',
            layout: {
                pack: 'center'
            },
            ui: 'footer',
            itemId: 'footer',
            items: [
                {
                    xtype: 'rallybutton',
                    text: 'Save & Calculate',
                    handler: function() {
                        this._save();
                    },
                    scope: this
                },
                {
                    xtype: 'rallybutton',
                    text: 'Cancel',
                    ui: 'link',
                    handler: function() {
                        this.hide();
                    },
                    scope: this
                }
            ]
        });
	},
	setFormula: function(formula) {
		this.formula = formula;
		this.down('#formula_box').setValue(this.formula); 
	},
	_save: function() {
		if (this.fireEvent('beforeformulasave', this.formula) !== false) {
			console.log("About to save", this.formula);
			this.hide();
		}
	}
});