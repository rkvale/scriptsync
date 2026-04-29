(function executeRule(current, previous /*null when async*/) {
	var logLevelPropertyName = 'servicemappingutil.log.level';

	var util = new servicemappingutil();
	//creating the logger :-)
	var logger = new GSLog(logLevelPropertyName, 'BR - ServiceMappingUtil');	
	logger.logDebug("Initializing");	

	logger.logDebug("change request sys_id: " + current.task.sys_id);
	var change_id = current.task.sys_id;
	logger.logDebug("CI sys_id: " + current.ci_item.sys_id);
	logger.logDebug("operation: " + current.operation());

	if(current.operation().toLowerCase() === 'delete'){
		logger.logDebug("Delete operation detected: ");
		logger.logDebug("change_id: " + current.task.sys_id);
		var gr_cap = new GlideRecord("u_task_cmdb_ci_business_cap");
		gr_cap.addEncodedQuery("u_task=" + current.task.sys_id);
		gr_cap.query();
		if(gr_cap.hasNext()){
			logger.logDebug("removing: " + gr_cap.getRowCount() + " impacted capabilities for change request with sysid " + current.task.sys_id);
			gr_cap.deleteMultiple();
		}else{
			logger.logDebug("no impacted caps found for change request with sysid " + current.task.sys_id);
		}

		//need to re-add the impacted capabilities, no need to check for existing ones as they should all be removed in the delete operation
		var parents = [];
		var cis = util.get_affected_cis(change_id);
		if (cis.length > 0){
			logger.logDebug("affected CIs: " + cis.toString());
			for(const ci of cis){
				logger.logDebug("CI: " + ci);
				parents.push(util.fetch_parents(ci));
			}
			//remove duplicates from parents array
			var unique_parents = new Set(parents.flat());
			if(unique_parents.size > 0){
				parents = [...unique_parents];
				logger.logDebug("Parent business applications: " + parents.toString());
				util.create_impacted(parents,change_id);
			}else{
				throw new Error("No parent business applications found for the affected CIs.");
			}
		}



	}else if(current.operation().toLowerCase() === 'insert'){
		logger.logDebug("Insert operation detected: " + current.sys_id);
			var parents = [];

		var cis = util.get_affected_cis(change_id);
		//var cis = [];
		if (cis.length > 0){
//			var parents = [];
			logger.logDebug("affected CIs: " + cis.toString());

			for(const ci of cis){
				logger.logDebug("CI: " + ci);
				parents.push(util.fetch_parents(ci));
			}
			//remove duplicates from parents array
			var unique_parents = new Set(parents.flat());
			if(unique_parents.size > 0){
				parents = [...unique_parents];
				logger.logDebug("Parent business applications: " + parents.toString());
				var impacted_cap = util.get_impacted_cap(change_id,"cap");
				var diff = Array.from(parents).filter((num) => !impacted_cap.includes(num));
				util.create_impacted(diff,change_id);
			}else{
				throw new Error("No parent business applications found for the affected CIs.");
			}
			//get business applications
/*			try{
				var impacted_cap = util.get_impacted_cap(change_id,"cap");
				var diff = Array.from(parents).filter((num) => !impacted_cap.includes(num));
				util.create_impacted(diff,change_id);
			}catch(err){
				logger.logDebug("error: " + err);
			}*/
		}else{
			logger.logDebug("no affected CIs found");
			parents.push(util.fetch_parents(current.ci_item.sys_id));
			logger.logDebug("Parents of the CI " + current.ci_item.sys_id + ": " + parents.toString());
			var unique_parents = new Set(parents.flat());
			if(unique_parents.size > 0){
				parents = [...unique_parents];
				logger.logDebug("Parent business applications: " + parents.toString());
				var impacted_cap = util.get_impacted_cap(change_id,"cap");
				var diff = Array.from(parents).filter((num) => !impacted_cap.includes(num));
				util.create_impacted(diff,change_id);
			}else{
				logger.logDebug("No parent business applications found for the CI " + current.ci_item.sys_id);
//		throw new Error("No parent business applications found for the affected CIs.");
			}
			//get business applications
/*			try{
				logger.logDebug("change_id: " + change_id);				
				var impacted_cap = util.get_impacted_cap(change_id,"cap");
				var diff = Array.from(parents).filter((num) => !impacted_cap.includes(num));
				util.create_impacted(diff,change_id);
			}catch(err){
				logger.logDebug("error: " + err);
			}
*/
		}

	}
	// Add your code here




})(current, previous);