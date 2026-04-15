/*
 * Post sensor: You can update/add missing info to the DB based on result (Json) from
 * Identification Engine
 * Output parameters in Post sensor mode: payload 
 */

//create logger, uses the same property as servicemappingutil script include
this.logger = new GSLog("servicemappingutil.log.level","ServiceMapping");
this.logger.includeTimestamp();


var rtrn = {};

try{
	// parsing the json string to a json object
	var payloadObj = JSON.parse(payload).items;

	//fetch sysId for neighbor records
	var related = payloadObj
		.filter(item => item.hasOwnProperty("relatedItems"))
		.filter(sub => sub.relatedItems
			.some(some => some.className === "discovery_device_neighbors"))
			.map(item => item.relatedItems[0].sysId);
			
	this.logger.logDebug("Neighbors: " + JSON.stringify(related));

}catch(error){
	this.logger.logErr("Failed getting sysIds from json payload: " + error);
}


// Clearing payload string to save memory
payload = null;
// Put your business logic here
// For node logger, please use: prePostNodeLogger.info\warn\error\debug(prePostLogPrefix + '<YOUR_LOG_STATEMENT>')
// You can return a message and a status, on top of the input variables that you MUST return.
// Returning the payload as a Json String is mandatory in case of a pre sensor script, and optional in case of post sensor script.
// If you want to terminate the payload processing due to your business logic - you can set isSuccess to false.
rtrn = {
	'status': {
		'message': 'Enter your message here',
		'isSuccess' :true
	},
	'patternId': patternId
};
