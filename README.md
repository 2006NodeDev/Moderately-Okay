Project 2

This one is going to be a little more freeform than the last one. You should already have a complete user service and a front end from your team’s experience in project 1. Work together as a team to get the source code for the user-service. Work together to grab the best of everyone’s front ends. Then you have to add another service to your project two to make it do something besides manage user data. Maybe you add a forum board service for people to communicate, or an item service for people to add items to a cart and potentially buy them. Feel free to be creative. You of course also need to expand the front end to incorporate your new service’s functionality. There are also some new requirements on deployment technologies  and the like see below.

Process
-	Daily standup with team every morning/night
-	Leads report standup to me everyday
-	Do scrum ( make a trello(free kanban board tech) board , make user stories, give them points ) 
-	Build like fullstack developers ( build a feature front to back/ back to front )
-	Work as a team, its you against the code
Requirements
-	User service for managing user info ( p1 )
-	Jwt for auth or Cloud identity platform ( stretch )
-	A new service 
-	Synchronous communication between services
-	There should be at least one foreign key between the two services databases
-	Asynchronous messaging between the services for eventual consistency (pub sub )
-	Must utilized one other Google API ( like maps or gsuite or something ) 
Deployment
-	Both services deployed in kubernetes behind an ingress 
-	Frontend deployed in a bucket or in kubernetes
-	Cloud sql for database or database container within service pod (stretch)
-	Logs should go to cloud logging 
-	Logs should be backed up into Cloud Storage
-	At least one check set up in cloud monitoring
-	Istio is optional ( stretch )
