var relation = new GlideRecord("cmdb_rel_ci");

var querystring= "parent.sys_id=94f46e21b0f0a810eb3f3df6315d99f2^child.sys_id=a131f26db078a810eb3f3df6315d997d^type=3deab95338a02000c18673032c71b876"
relation.addEncodedQuery(querystring);

relation.query();
relation.parent = "94f46e21b0f0a810eb3f3df6315d99f2";
relation.child = "a131f26db078a810eb3f3df6315d997d";
relation.type = "3deab95338a02000c18673032c71b876";

relation.insert();




//testing