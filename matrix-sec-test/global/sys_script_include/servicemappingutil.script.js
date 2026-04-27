var servicemappingutil = Class.create();
servicemappingutil.prototype = {
    initialize: function() {
		var logLevelPropertyName = this.type + '.log.level';

		//creating the logger :-)
		this.logger = new GSLog(logLevelPropertyName, this.type);	
		this.logger.logDebug("Initializing");	

		this.relations = ['60bc4e22c0a8010e01f074cbe6bd73c3','1a9cb166f1571100a92eb60da2bce5c5']; //Runs::on, Depends::on
		this.services = []; //result array for 
		this.affected_cis = []; //result array for affected CIs from change request
		this.impacted_services = []; //result array for impacted services from change request
		this.biz_app = []; //result array for business applications
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
	 * get all affected CIs for a given Change Request
	 * @param {*} change_sysid - sysid for the change request you want to get affected CIs for
	 * @return array of sysid of affected CIs
	 */
	get_affected_cis: function(change_sysid){
		this.logger.logDebug("Getting affected CIs for change request with sysid " + change_sysid);
		var affected_query = "task.sys_idSTARTSWITH" + change_sysid;
		this.logger.logDebug("Encoded query for affected CIs: " + affected_query);
		var gr = new GlideRecord("task_ci");
		gr.addEncodedQuery(affected_query);
		gr.query();
		
		while(gr.next()){
			this.logger.logDebug("Found affected CI with sysid " + gr.ci_item);
			this.affected_cis.push(gr.ci_item.toString());
		}
		this.logger.logDebug("Affected CIs:	 " + this.affected_cis);
		return this.affected_cis;
	},

	/**
	 * get all impacted business capabilities for a given change request.
	 * @param {*} change_sysid 
	 * @return array of sysid for affected services
	 */
	get_impacted_services: function(change_sysid){
		this.logger.logDebug("Getting impacted services for change request with sysid " + change_sysid);
		var gr_task_biz_cap = new GlideRecord("task_cmdb_ci_business_app");
		var impacted_query = "task.sys_idSTARTSWITH" + change_sysid;
		this.logger.logDebug("Encoded query for impacted services: " + impacted_query);
		gr_task_biz_cap.addEncodedQuery(impacted_query);
		gr_task_biz_cap.query();
		while(gr_task_biz_cap.next()){
			this.logger.logDebug("Found impacted service with sysid " + gr_task_biz_cap.cmdb_ci_service);
		}
	},


	/**
	 * get all impacted business applications for a given change request.
	 * @param {*} change_sysid 
	 * @return array of sysid for affected business applications
	 */
	get_business_applications: function(change_sysid){
		this.logger.logDebug("Getting businnes applications for change request with sysid " + change_sysid);
		var gr_task_biz_app = new GlideRecord("task_cmdb_ci_business_app");
		var impacted_query = "task.sys_idSTARTSWITH" + change_sysid;
		this.logger.logDebug("Encoded query for impacted services: " + impacted_query);
		gr_task_biz_app.addEncodedQuery(impacted_query);
		gr_task_biz_app.query();
		while(gr_task_biz_app.next()){
			this.logger.logDebug("Found business application with sysid " + gr_task_biz_app.business_application);
			this.biz_app.push(gr_task_biz_app.business_application.toString());
		}
		return this.biz_app;
	},


	/**
	* find all parent with a given relations to the CI provided
	*
	* @param {string} sys_id - cmdb_ci sys_id 
	* @return {array} this.result - holds sys_id to all parent business application and business capabilities
	*/
	fetch_parents: function(sys_id){
		var gr = new GlideRecord("cmdb_ci");

		if(gr.get(sys_id)){
			this.logger.logDebug("Current CI name: " + gr.name + " and type: " + gr.getRecordClassName());
			var gr_rel = new GlideRecord('cmdb_rel_ci');
			var query = 'child=' + sys_id;

			gr_rel.addEncodedQuery(query);
			gr_rel.query();

			if(gr_rel.hasNext()){
				while(gr_rel.next()){
					this.logger.logDebug("Found parent relation for CI with sys_id " + sys_id + ". Parent sys_id: " + gr_rel.parent.sys_id);
					//found parent, recursively call the function with the parent sys_id to find more parents
					this.fetch_parents(gr_rel.parent);
				}
			}else{
				this.logger.logDebug("No more parents found for CI " + gr.name);
			};
			//check if the found parent is of type business application or business capability, if yes add to result array
			//if(gr.getRecordClassName() === "cmdb_ci_business_capability" || gr.getRecordClassName() === "cmdb_ci_business_app"){
			//check if the found parent is of type business application, if yes add to result array
			if(gr.getRecordClassName() === "cmdb_ci_business_app"){
				this.logger.logDebug("Adding parent " + gr.name + " to result array.");
				this.result.push(sys_id.toString());
			}else{
				this.logger.logDebug("Parent with " + gr.name + " is not of type cmdb_ci_business_application. Not adding to result array.");
			}
		}else{
			this.logger.logWarning("Could not find CI record " + gr.name);
		}

		//remove duplicates from result array
		if(this.result.length > 0){
			this.logger.logDebug("Removing duplicates from result array. " + this.result);
			var unique_result = new Set(this.result);
			this.result = [...unique_result];
			this.logger.logDebug("Result array after removing duplicates: " + this.result);
		}else{
			this.logger.logDebug("Result array is empty, no duplicates to remove.");
		}
		return this.result;
	},

    type: 'servicemappingutil'
};
