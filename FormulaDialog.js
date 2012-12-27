/*global console, Ext */
/*
 * 
 * Pass in app as a config object so we can save from the dialog
 *  
 */
Ext.define( 'PXS.ui.dialog.FormulaDialog', {
	extend: 'Rally.ui.dialog.Dialog',
	requires: [ 'Rally.ui.Button' ],
	closable: false,
	stateful: false,
	formula: null,
	app: null,
	config: {
		
	},
	constructor: function(config) {
		this.mergeConfig(config);
		this.callParent(arguments);

		this.addHeader();
		this.addEditor();
		this.addFooter();
		if ( this.app && this.app.settings ) {
			this.setFormula( this.app.settings.Formula );
		}
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
        ],
        [
         /**
          * @event
          * Fired after saving the formula.
          * @param formula the formula being saved. 
          */
          'afterformulasave'
     ]);
	},
	addHeader: function() {
		this.add( {
            xtype: 'component',
            html: 'To calculate a value for the items in the grid, enter a formula below.<br/><br/>' +
                    'Use the format FieldName = FieldA + FieldB<br/><br/>' + 
                    'Special formula:<ul>' +
                    '<li>hasTag("myTag") ? 1:0  will be 1 if the item has the tag and 0 if not</li>' +
                    '<li>Parent.RiskScore will give the Risk Score of the parent (dot notation works to 1 level)</li>' +
                    "<li>applyMap('Priority',{ 'PO':5, 'Default':12, 'P1':2 }) will return a 5 when Priority is PO</li>" +
                    '</ul>',
            padding: 10
        } );
	},
	addEditor: function() {
		this.add({
                padding: 10,
                xtype: 'rallytextfield',
                fieldLabel: 'Formula',
                width: 350,
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
                    	this.formula = this.down('#formula_box').getValue();
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
		this.down('#formula_box').setValue(formula); 
	},
	_save: function() {
		if (this.fireEvent('beforeformulasave', this.formula) !== false) {
			if ( this.app ) {
		        this.app.updateSettingsValues( { settings: { Formula: this.formula } });
			} else {
				window.console && console.log( "No app provided in dialog creation" );
			}
			this.fireEvent('afterformulasave', this.formula);
			
			this.hide();
		}
	}
});