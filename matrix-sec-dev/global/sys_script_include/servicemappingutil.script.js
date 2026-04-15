var servicemappingutil = Class.create();
servicemappingutil.prototype = {
    initialize: function() {
		var logLevelPropertyName = this.type + '.log.level';

		//creating the logger :-)
		this.logger = new GSLog(logLevelPropertyName, this.type);	
		this.logger.logDebug("Initializing");	

		this.relations = ['60bc4e22c0a8010e01f074cbe6bd73c3','1a9cb166f1571100a92eb60da2bce5c5']; //Runs::on, Depends::on
		this.services = [];
		this.result = [];
		//If the log level property does no exists we create it
		if(!gs.getProperty(logLevelPropertyName)){
			var gr_property = new GlideRecord('sys_properties');
			gr_property.initialize();
			gr_property.name = logLevelPropertyName;
			gr_property.setWorkflow(false);
			gr_property.value = 'info';
			var something = gr_property.insert();
		}
		
		//setting up query type parameter
		//create_type_query(this.relations);
    }, //end initializing


	/**
	 * Create relations between two CIs(switches) based on device neighbors
	 * The sysid are sysid to neighbor record in discovery_device_neighbors table
	 * @param {*} arr_sysids 
	 */
	create_neighbors: function(arr_sysids){
		this.logger.logDebug("creating neighbors for the following neighbor record sysid: " + arr_sysids.length + arr_sysids.toString());
		var type = "3deab95338a02000c18673032c71b876"; //Connected by::Connects
		for (const sysid of arr_sysids){
			var neighbor = new GlideRecord("discovery_device_neighbors");
			if(neighbor.get(sysid)){
				this.logger.logDebug("checking relations between the following devices (switches) " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci);

				var querystr = "parent.sys_id=" + neighbor.cmdb_ci + "^child.sys_id=" + neighbor.neighbor_interface.cmdb_ci + "^type.sys_id=3deab95338a02000c18673032c71b876";
				this.logger.logDebug("encoded query for relation: " + querystr);
				
				var relation = new GlideRecord("cmdb_rel_ci");
				relation.addEncodedQuery(querystr);
				relation.query();

				if(relation.getRowCount() > 0){
					this.logger.logDebug("Relation already exists between " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci);
					continue;
				}else{
					this.logger.logDebug("No relation exists between " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci + ". Creating relation.");
					relation.initialize();
					relation.parent = neighbor.cmdb_ci;
					relation.child = neighbor.neighbor_interface.cmdb_ci;
					relation.type = type;
					var relation_sysid = relation.insert();
					this.logger.logDebug("Created relation with sysid: " + relation_sysid);
				}

			}else{
				this.logger.logWarning("Could not find neighbor record with sysId " + sysid);
				continue;	
			};

		};

	},
	
	//not finished yet :-)
	create_type_query: function(rels){
		gs.info('RELATIONS ' + rels)
	},

	/**
	* find all parent with a given relations to the CI provided
	*
	* @param {string} sys_id - cmdb_ci sys_id 
	* @return {array} something - holds sys_id to all parents
	*/
	fetch_parent: function(sys_id){
		//gs.info("testing");
		var relations = ['1a9cb166f1571100a92eb60da2bce5c5']; //depends:on

		var gr_rel = new GlideRecord('cmdb_rel_ci');
		var query = 'child=' + sys_id + '^type=1a9cb166f1571100a92eb60da2bce5c5';
		gr_rel.addEncodedQuery(query);
		gr_rel.query();

		if(gr_rel.hasNext()){
			while(gr_rel.next()){
					this.result.push(gr_rel.parent.toString());
					this.fetch_related02(gr_rel.parent);
			}
			return this.result;
		}else{
			return;
		}
	},

    type: 'servicemappingutil'
};
