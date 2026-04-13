var test = new servicemappingutil();

var sysids = ["0741ec8ec9bc2010eb3fab42ed68491c","72ecc5c7b98a92d8eb3fd9a19a1bdd30","7eecc5c7b98a92d8eb3fd9a19a1bdd2f","f6ec05c7b98a92d8eb3fd9a19a1bdd08"];

test.create_neighbors(sysids);


//gs.info(test.fetch_parent("0311e0cac9bc2010eb3fab42ed6849be "));	


//parent.sys_id=0311e0cac9bc2010eb3fab42ed6849be^type.sys_id=3deab95338a02000c18673032c71b876^child.sys_id=d6282ea5b074a810eb3f3df6315d998c

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