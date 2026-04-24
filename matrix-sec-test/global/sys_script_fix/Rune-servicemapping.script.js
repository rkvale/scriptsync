//var test = new servicemappingutil();
//var sysids = ["69e4ee61df837650f6b69e16c11e260d","2de4ee612883765038ac5e53f4c0bf0d","38ff7ac7fc93d550eb3f785274505230","0e89e536dd01e1d4eb3f744d6cffcaf4"];
//test.create_neighbors(sysids);
//var test = new servicemappingutil();
//var sysids = ["52e5077817b7f69019b07d38aa55506b"];
//var sysids = ["2e08ffe575f7b29052321174bdc26924", "6a08ffe572f7b290bce6230ec87a0924", "6608ffe552f7b290c529dc5131361422"];
//test.create_neighbors(sysids);


// test gliderecord
//var gr = new GlideRecord("cmdb_ci");
//gr.get("940aa2f2c9306410eb3fab42ed684952");

//gs.info("table: " + gr.getTableName());
//gs.info("record class name: " + gr.getRecordClassName());
//if(gr.getRecordClassName() === "cmdb_ci_business_app"){
//	gs.info("found a business application");
//}

//test fetch parent new
var test = new servicemappingutil();
var huba = test.fetch_parents("6f8368f847bbb2902af1179095f63c24");
gs.info("biz niz: " + huba.toString());

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
