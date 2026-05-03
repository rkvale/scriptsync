var logLevelPropertyName = "servicemappingutil-event.log.level";

this.logger = new GSLog(logLevelPropertyName, "RefreshImpCapabilitiesService");
this.logger.logDebug("Initializing RefreshImpCapabilitiesService event script");

//const change = current.task;
const change = current;
const service = current.ci_item;
const operation = event.parm1;
this.logger.logDebug("Change sys_id: " + change.sys_id);




const affCis = new GlideRecord("task_ci");
if (operation == "delete") {
//    affCis.addEncodedQuery("task=" + task + "^added_from_dynamic_ci!=NULL");
    this.logger.logDebug("Delete operation detected, querying for dynamically added CIs");
} else {
 //   affCis.addEncodedQuery("task=" + task + "^added_from_dynamic_ci=" + service);
    this.logger.logDebug("Update operation detected, querying for dynamically added CIs");  
}
//affCis.query();

while (affCis.next()) {
    //handle update of impacted capabilities
}