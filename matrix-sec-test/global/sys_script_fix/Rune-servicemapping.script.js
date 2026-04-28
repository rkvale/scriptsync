//var test = new servicemappingutil();
//var sysids = ["69e4ee61df837650f6b69e16c11e260d","2de4ee612883765038ac5e53f4c0bf0d","38ff7ac7fc93d550eb3f785274505230","0e89e536dd01e1d4eb3f744d6cffcaf4"];
//test.create_neighbors(sysids);
//var test = new servicemappingutil();
//var sysids = ["52e5077817b7f69019b07d38aa55506b"];
//var sysids = ["2e08ffe575f7b29052321174bdc26924", "6a08ffe572f7b290bce6230ec87a0924", "6608ffe552f7b290c529dc5131361422"];
//test.create_neighbors(sysids);


//testing array differences
var arr1 = ["a", "b", "c", "d"];
var arr2 = ["c"];

var diff1 = arr1.filter(x => !arr2.includes(x));
var diff2 = arr2.filter(x => !arr1.includes(x));
//gs.info("Difference between arr1 and arr2: " + diff1.toString());	
//gs.info("Difference between arr2 and arr1: " + diff2.toString());	



const res1 = Array.from(arr1).filter((num) => !arr2.includes(num));
const res2 = Array.from(arr2).filter((num) => !arr1.includes(num));
//gs.info("Difference between arr1 and arr2: " + res1.toString());
//gs.info("Difference between arr2 and arr1: " + res2.toString());

// test gliderecord
//var gr = new GlideRecord("cmdb_ci");
//gr.get("940aa2f2c9306410eb3fab42ed684952");

//gs.info("table: " + gr.getTableName());
//gs.info("record class name: " + gr.getRecordClassName());
//if(gr.getRecordClassName() === "cmdb_ci_business_app"){
//	gs.info("found a business application");
//}

var arr_parent = ["cc2c77bba894cb103b3c28601cd9972b","2ce5c72a7079d2103b3cd555ddc8c6e1","0d84c3a67079d2103b3cd555ddc8c65f","59d5c72a7079d2103b3cd555ddc8c633"];
var arr_cap = ["0d84c3a67079d2103b3cd555ddc8c65f"];
//gs.info("typeof :" + typeof arr_parent);
//gs.info("typeof :" + typeof arr_cap);
//gs.info("Difference between arr_parent and arr_cap: " + Array.from(arr_parent).filter((num) => !arr_cap.includes(num)).toString());





//FULL Test
var test = new servicemappingutil();
var change_id = "7498bf050518c7103b3c54417919dc6a";

var cis = test.get_affected_cis(change_id);
//var cis = [];
if (cis.length > 0){
	var parents = [];
	gs.info("affected CIs: " + cis.toString());
	for(const ci of cis){
		gs.info("CI: " + ci);
		parents.push(test.fetch_parents(ci));
	}
	//remove duplicates from parents array
	var unique_parents = new Set(parents.flat());
	parents = [...unique_parents];
	gs.info("Parent business applications: " + parents.toString());
	//get business applications
	try{
		var impacted_cap = test.get_impacted_cap(change_id,"cap");
//		gs.info("Impacted business capabilities: " + impacted_cap.toString());
//		gs.info("typeof impacted_cap: " + typeof impacted_cap);
// 		gs.info("typeof parents: " + typeof parents);		
//		gs.info("Difference between arr_parent and arr_cap: " + Array.from(parents).filter((num) => !impacted_cap.includes(num)).toString());
		var diff = Array.from(parents).filter((num) => !impacted_cap.includes(num));
		gs.info("Length of impacted business capabilities: " + diff.length);
		gs.info("Business capabilities to be added to the change:" + diff.toString());

//		test.create_impacted(diff,change_id);
	}catch(err){
		gs.info("error: " + err);
	}
}else{
	gs.info("no affected CIs found");
}


//test.get_impacted_services("7498bf050518c7103b3c54417919dc6a");


//test fetch parent new
//var huba = test.fetch_parents("6f8368f847bbb2902af1179095f63c24");
//gs.info("biz niz: " + huba.toString());

//test fetch parent
//var test = new servicemappingutil();
//var ids = test.fetch_parent("6f8368f847bbb2902af1179095f63c24");
//var ids = test.fetch_parent("683bcdd828c0f0d0eb3fd439ce24f651");
//gs.info("PARENT IDS: " + ids);



/*
this.bsm = new SNC.BusinessServiceManager();

this.apputil = new ApplicationServiceUtil();



var gr = new GlideRecord("cmdb_ci_service_discovered");
var gr02 = new GlideRecord("cmdb_ci_service_discovered");
var gr03 = new GlideRecord("cmdb_ci_service_discovered");
var gr_ci = new GlideRecord("cmdb_ci");
gr_ci.get("49e2d5fe858a0950eb3f0d59cfa275ba");

if (gr_ci){
	gs.info("found CI " + gr_ci.getUniqueValue());
}
*/

/*
// Create a new application service
gr.initialize();
gr.setValue("name", "Application service script 0001");
gr.setValue("busines_criticality", "3 - less critical");
gr.setValue("traffic_discovery", false);
gr.setValue("operational_status", 1);
//gr.setValue("u_system_id", system.getValue("u_system_id"));
gr.setValue("environment", "BRUT CDN");
gr.setValue("used_for", "Prod");
gr.setValue("u_service_type", 50); //Application
//gr.setValue("support_group", system.getValue("u_am_group"));
var sys_id = gr.insert();


// Create a new application service
gr02.initialize();
gr02.setValue("name", "Application service script 0011");
gr02.setValue("busines_criticality", "3 - less critical");
gr02.setValue("traffic_discovery", false);
gr02.setValue("operational_status", 1);
//gr.setValue("u_system_id", system.getValue("u_system_id"));
gr02.setValue("environment", "BRUT CDN");
gr02.setValue("used_for", "Prod");
gr02.setValue("u_service_type", 50); //Application
//gr.setValue("support_group", system.getValue("u_am_group"));
var sys_id02 = gr02.insert();
*/

// Create a new application service
/*
var sys_id02 = "5f9df2923027be103b3c3e1a2df7c67e";
gr03.initialize();
gr03.setValue("name", "Application service script 0111");
gr03.setValue("busines_criticality", "3 - less critical");
gr03.setValue("traffic_discovery", false);
gr03.setValue("operational_status", 1);
//gr.setValue("u_system_id", system.getValue("u_system_id"));
gr03.setValue("environment", "BRUT CDN");
gr03.setValue("used_for", "Prod");
gr03.setValue("u_service_type", 50); //Application
//gr.setValue("support_group", system.getValue("u_am_group"));
var sys_id03 = gr03.insert();

// if (sys_id) {
// 	this._createRelationshipBetweenServiceAndSystem(system.getUniqueValue(), sys_id);
// 	this._updateRelationshipBetweenServerAndService(sys_id, hardware_ci.getUniqueValue());
	gs.info("addserviceCI");
	//this.apputil._addServiceCI(sys_id, gr_ci.getUniqueValue());
	//this.apputil._addServiceCI(sys_id02, sys_id);
	//this._addServiceCI(sys_id, gr_ci.getUniqueValue());
	this.apputil._addServiceCI(sys_id03, sys_id02);

// 	this._updateMonitoring(sys_id);
 //}
 */
