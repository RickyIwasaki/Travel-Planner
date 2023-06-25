
GRANT CONNECT ON DATABASE travel_planner TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.users_id_seq TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.travel_plans_id_seq TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.locations_id_seq TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.user_to_travel_plans_id_seq TO travel_planner_user;
GRANT USAGE, SELECT ON schema1.travel_plans_to_locations_id_seq TO travel_planner_user;

GRANT ALL PRIVILEGES ON schema1.users TO travel_planner_user;
GRANT ALL PRIVILEGES ON schema1.travel_plans TO travel_planner_user;
GRANT ALL PRIVILEGES ON schema1.locations TO travel_planner_user;
GRANT ALL PRIVILEGES ON schema1.user_to_travel_plans TO travel_planner_user;
GRANT ALL PRIVILEGES ON schema1.travel_plans_to_locations TO travel_planner_user;

GRANT USAGE ON SCHEMA schema1 TO travel_planner_user;
