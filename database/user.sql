
GRANT CONNECT ON DATABASE travel_planner TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.vendors_id_seq TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.items_id_seq TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.api_keys_id_seq TO travel_planner_user;

GRANT ALL PRIVILEGES ON schema1.vendors TO travel_planner_user;
GRANT ALL PRIVILEGES ON schema1.items TO travel_planner_user;
GRANT ALL PRIVILEGES ON schema1.api_keys TO travel_planner_user;

GRANT USAGE ON SCHEMA schema1 TO travel_planner_user;
