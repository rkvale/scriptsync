var servicemappingutil = Class.create();
servicemappingutil.prototype = {
    initialize: function() {
		var logLevelPropertyName = this.type + '.log.level';
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
		//creating the logger :-)
		this.logger = new GSLog(logLevelPropertyName, this.type);	
		this.logger.logDebug("Initializing");	
		
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
		var query = "parent.sysIdSTARTSWITHtest^child.nameSTARTSWITHtest^type=3deab95338a02000c18673032c71b876"	
		var type = "3deab95338a02000c18673032c71b876"; //Connected by::Connects
		for (const sysid of arr_sysids){
			var neighbor = new GlideRecord("discovery_device_neighbors");
			if(neighbor.get(sysid)){
				this.logger.logDebug("creating relations between the following devices (switches) " + neighbor.cmdb_ci + " and " + neighbor.neighbor_interface.cmdb_ci);
				var relation = new GlideRecord("cmdb_rel_ci");
				relation.initialize();
				relation.parent = ;
				relation.child = type;
				relation.type = "";
			}else{
				this.logger.logWarning("Could not find neighbor record with sysId " + sysid);
			};

		};

	},
	
	//not finished yet :-)
	create_type_query: function(rels){
		gs.info('RELATIONS ' + rels)
	},

	/** en liten test
	* find all parent with a given relations to the CI provided
	*
	* @param {string} sys_id - cmdb_ci sys_id 
	* @return {array} something - holds sys_id to all parents
	*/
	fetch_parent: function(sys_id){
		gs.info("testing");
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




	/**
	* find all 
	*
	* @param {(type)} (Variable name) - (desc) 
	* @return {(type)} (Variable name) - (desc)
	*/
	fetch_related02: function(sys_id){
		

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
	fetch_relatedbackup: function(sys_id){
		var gr_rel = new GlideRecord('cmdb_rel_ci');
		var query = 'child=' + sys_id + '^type=1a9cb166f1571100a92eb60da2bce5c5';
		gr_rel.addEncodedQuery(query);
		gr_rel.query();
		//gs.info(gr_rel.getRowCount());
		if(gr_rel.hasNext()){
			while(gr_rel.next()){
					gs.info("parent: " + gr_rel.parent.name + ' - ' + gr_rel.parent);
					gs.info("this.result01: " + this.result);
					this.result.push(gr_rel.parent.toString());
					//this.result.push(gr_rel.parent);
					gs.info("this.result02: " + this.result);
					gs.info("return while " + this.fetch_related02(gr_rel.parent));
					//return "testing";
					
					//return gr_rel.parent.name;
			}
			return this.result;
		}else{
			return "nope";
		}

		//gs.info("result  " + this.result);
		//return this.result;
	},
	fetch_related: function(sys_id){
		try{
			var query = 'child=' + sys_id + '^type=1a9cb166f1571100a92eb60da2bce5c5';
			var gr_rel = new GlideRecord('cmdb_rel_ci');
			gr_rel.addEncodedQuery(query);
			gr_rel.query();
			if(gr_rel.hasNext()){
				while(gr_rel.next()){
					gs.info("Child: " + gr_rel.child.name + ' - ' + gr_rel.child.sys_id);
					gs.info("parent: " + gr_rel.parent.name + ' - ' + gr_rel.parent);
					//this.result.push(this.fetch_related(gr_rel.parent.sys_id));
					this.fetch_related(gr_rel.parent.sys_id);
					gs.info("RESULT: " + this.result);
					//gs.info("RETURN ********* " + gr_rel.child.sys_id);
					//return gr_rel.child.sys_id;					
				}
					gs.info("RETURN ********* " + gr_rel.child.sys_id);
					//return gr_rel.child.sys_id;
					return this.result.push(gr_rel.child.sys_id);


			}else{
				//tomt
				gs.info("TOM *********: " + sys_id);
				//return sys_id;
				return this.result.push(sys_id);
			}

			//gs.info("#####################: " + gr_rel.child.sys_id);
			//return this.result;	
		}catch(error){
			this.logger.logWarning("hmmm: " + error);
		}
		gs.info("??????????????????????????????");
		return this.result;
	},


    type: 'servicemappingutil'
};
