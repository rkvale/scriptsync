(function executeRule(current, previous /*null when async*/) {
	var logLevelPropertyName = 'servicemappingutil.log.level';

	var util = new servicemappingutil();
	//creating the logger :-)
	var logger = new GSLog(logLevelPropertyName, 'BR - ServiceMappingUtil');	
	logger.logDebug("Initializing - BR - ServiceMappingUtil");	

	logger.logDebug("operation: " + current.operation());
	logger.logDebug("change request sys_id: " + current.task.sys_id);
	logger.logDebug("CI sys_id: " + current.ci_item.sys_id);

	if(current.operation().toLowerCase() === 'delete'){
		logger.logDebug("Delete operation detected: ");
	}else if(current.operation().toLowerCase() === 'insert'){
		logger.logDebug("Insert operation detected: " + current.sys_id);

		var cis = util.get_affected_cis(change_id);
		//var cis = [];
		if (cis.length > 0){
			var parents = [];
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
			}else{
				throw new Error("No parent business applications found for the affected CIs.");
			}
			//get business applications
			try{
				var impacted_cap = util.get_impacted_cap(change_id,"cap");
				var diff = Array.from(parents).filter((num) => !impacted_cap.includes(num));
				util.create_impacted(diff,change_id);
			}catch(err){
				logger.logDebug("error: " + err);
			}
		}else{
			logger.logDebug("no affected CIs found");
}

	}
	// Add your code here




})(current, previous);