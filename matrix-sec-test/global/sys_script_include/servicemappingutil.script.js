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
		this.result_new = [];

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
				var testing = neighbor.neighbor_interface.cmdb_ci;
				if(neighbor.getValue("neighbor_interface") === null){
					this.logger.logDebug("Neighbor record with sysId " + sysid + " has null value in neighbor_interface.cmdb_ci field. Skipping this record.");
					continue;
				}else{
					this.logger.logDebug("Processing neighbor record with sysId " + sysid + " and neighbor_interface.cmdb_ci " + neighbor.neighbor_interface.cmdb_ci);
				}
				
				this.logger.logDebug("checking relations between the following devices (switches) " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci);

				var querystr = "parent.sys_id=" + neighbor.cmdb_ci + "^child.sys_id=" + neighbor.neighbor_interface.cmdb_ci + "^type.sys_id=3deab95338a02000c18673032c71b876";
//				var reversed_querystr = "parent.sys_id=" + neighbor.neighbor_interface.cmdb_ci + "^child.sys_id=" + neighbor.cmdb_ci + "^type.sys_id=3deab95338a02000c18673032c71b876";
				this.logger.logDebug("encoded query for relation: " + querystr);
//				this.logger.logDebug("encoded query for reversed relation: " + reversed_querystr);
				
				var relation = new GlideRecord("cmdb_rel_ci");
//				var reversed_relation = new GlideRecord("cmdb_rel_ci");

				relation.addEncodedQuery(querystr);
				relation.query();
//				reversed_relation.addEncodedQuery(reversed_querystr);
//				reversed_relation.query();

				if(relation.getRowCount() > 0){
					this.logger.logDebug("Relation already exists between " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci);
//					continue;
				}else{
					this.logger.logDebug("No relation exists between " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci + ". Creating relation.");
					relation.initialize();
					relation.parent = neighbor.cmdb_ci;
					relation.child = neighbor.neighbor_interface.cmdb_ci;
					relation.type = type;
					var relation_sysid = relation.insert();
					this.logger.logDebug("Created relation with sysid: " + relation_sysid);
				}
/*
				if(reversed_relation.getRowCount() > 0){
					this.logger.logDebug("Reversed relation already exists between " + neighbor.neighbor_interface.cmdb_ci + " and " + neighbor.cmdb_ci);
//					continue;
				}else{
					this.logger.logDebug("No reversed relation exists between " + neighbor.neighbor_interface.cmdb_ci + " and " + neighbor.cmdb_ci + ". Creating reversed relation.");
					reversed_relation.initialize();
					reversed_relation.parent = neighbor.neighbor_interface.cmdb_ci;
					reversed_relation.child = neighbor.cmdb_ci;
					reversed_relation.type = type;
					var reversed_relation_sysid = reversed_relation.insert();
					this.logger.logDebug("Created reversed relation with sysid: " + reversed_relation_sysid);
				}
*/
			}else{
				this.logger.logWarning("Could not find neighbor record with sysId " + sysid);
				continue;	
			};

		};

	},
	
	//not finished yet :-)
	create_type_query: function(rels){
		this.logger.logDebug("To be contunied...");
	},

	/**
	* find all parent with a given relations to the CI provided
	*
	* @param {string} sys_id - cmdb_ci sys_id 
	* @return {array} something - holds sys_id to all parents
	*/
	fetch_parent: function(sys_id){
		//var relations = ['1a9cb166f1571100a92eb60da2bce5c5']; //depends:on

		var gr_rel = new GlideRecord('cmdb_rel_ci');
		//var query = 'child=' + sys_id + '^type=1a9cb166f1571100a92eb60da2bce5c5';
		var query = 'child=' + sys_id;

		gr_rel.addEncodedQuery(query);
		gr_rel.query();

		if(gr_rel.hasNext()){
			while(gr_rel.next()){
				this.logger.logDebug("Found parent relation for CI with sys_id " + sys_id + ". Parent sys_id: " + gr_rel.parent.sys_id);
				this.logger.logDebug("parent type: " + gr_rel.parent.name);
				this.result.push(gr_rel.parent.toString());
				this.fetch_parent(gr_rel.parent);
			}
			return this.result;
		}else{
			return;
		}
	},

	list_parents: function(sys_id){
		var gr = new GlideRecord("cmdb_ci");
		if(gr.get(sys_id)){
			//this.logger.logDebug("Current CI name: " + gr.name + " and type: " + gr.getRecordClassName());
			var gr_rel = new GlideRecord('cmdb_rel_ci');
			var query = 'child=' + sys_id;

			gr_rel.addEncodedQuery(query);
			gr_rel.query();

			if(gr_rel.hasNext()){
				while(gr_rel.next()){
			//		this.logger.logDebug("Found parent relation for CI with sys_id " + sys_id + ". Parent sys_id: " + gr_rel.parent.sys_id);
			//		this.logger.logDebug("parent type: " + gr_rel.parent.name);
			//		this.result.push(gr_rel.parent.toString());
					this.list_parents(gr_rel.parent);
				}
			//	return this.result;
			}else{
				//this.logger.logDebug("No more parents found for CI " + gr.name);
//				if(gr.getRecordClassName() === "cmdb_ci_business_capability"){
//					this.logger.logDebug("Adding parent " + gr.name + " to result array.");
//					this.result_new.push(sys_id);
//				}else{
//					this.logger.logDebug("Parent with " + gr.name + " is not of type cmdb_ci_business_capability. Not adding to result array.");
//				}
//				return this.result;
			};

			if(gr.getRecordClassName() === "cmdb_ci_business_capability"){
				this.logger.logDebug("Adding parent " + gr.name + " to result array.");
				this.result.push(sys_id.toString());
			}else{
				this.logger.logDebug("Parent with " + gr.name + " is not of type cmdb_ci_business_capability. Not adding to result array.");
			}
			//return this.result;
	
		}else{
			this.logger.logWarning("Could not find CI record " + gr.name);
		}
		return this.result;
	},

	fetch_parent_new: function(sys_id){
		//var relations = ["41008aa6ef32010098d5925495c0fb94","1a9cb166f1571100a92eb60da2bce5c5"];
		this.logger.logDebug("Fetching parent for CI with sys_id " + sys_id);
		var gr_rel = new GlideRecord('cmdb_rel_ci');
		// var query = 'child=' + sys_id + '^type=1a9cb166f1571100a92eb60da2bce5c5';
		var query = 'child=' + sys_id;

		gr_rel.addEncodedQuery(query);
		gr_rel.query();	
			

		if(gr_rel.hasNext()){
			while(gr_rel.next()){
				this.logger.logDebug("Found parent relation: " + gr_rel.parent.name);	
				this.fetch_parent_new(gr_rel.parent);
		//		this.logger.logDebug("????????????????? Adding parent with sys_id " + gr_rel.parent.sys_id + " to result array.");
			//	var gr = new GlideRecord("cmdb_ci");
				// this.logger.logDebug("22222222222222222222");
			//	if(gr.get(gr_rel.parent.sys_id)){
					// this.logger.logDebug("333333333333333333");
			//		gr.next();
					// this.logger.logDebug("44444444444444444444");
					// cmdb_ci_business_capability cmdb_ci_business_app
			//		if(gr.getRecordClassName() === "cmdb_ci_business_capability"){
//						this.logger.logDebug("????????????????? Adding parent with sys_id " + gr_rel.parent.sys_id + " to result array.");
			//			this.result_new.push(gr_rel.parent.toString());
			//			this.logger.logDebug("&&&&&&&&&&&&&&&&&&&&&&& Parent record type: " + gr.getRecordClassName());					
			//		}else{
						// this.logger.logDebug("55555555555555555555");
			//		}
			//	}else{
			//		this.logger.logDebug("EEEEEEEEEEEEEEEEEEEEEElse ");
			//	}
			//this.logger.logDebug("************* Result: " + this.result_new);
			}
		}else{
			var gr = new GlideRecord("cmdb_ci");
			if(gr.get(sys_id)){
				this.logger.logDebug("No more parents found for CI with sys_id " + sys_id + ". Current CI name: " + gr.name + " and type: " + gr.getRecordClassName());
				if(gr.getRecordClassName() === "cmdb_ci_business_capability"){
					this.logger.logDebug("Adding parent " + gr.name + " to result array.");
					this.result_new.push(sys_id);
				}else{
					this.logger.logDebug("Parent with " + gr.name + " is not of type cmdb_ci_business_capability. Not adding to result array.");
				}
			}else{
				this.logger.logWarning("Could not find CI record with sys_id " + sys_id);
			}
			//this.logger.logDebug("############ No more parents found for CI with sys_id " + sys_id);
			//this.logger.logDebug("????????????????? Adding parent with sys_id " + gr_rel.parent.sys_id + " to result array.");
		}

		this.logger.logDebug("22222222222222222222 Result: " + this.result_new);
	},

    type: 'servicemappingutil'
};
