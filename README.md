## Architecture Solutions
Traditional, monolith web application
- Persistent running server
- Node/Laravel/Spring.* application framework
- Relational DB for accounts, robots, jobs, etc
- REST API in for interfacing with user-facing clients; sending tasks, requesting status
- REST API out for interfacing with robot

Hybrid cloud/traditional micro-architecture
- Mixed on demand and persistent running server(s)
- Simple framework for application routing
- Python/Node application running
- REST API in
- Event dispatches (SQS) out

Cloud only micro-architecture 
- On demand only services
- AWS APIGateway for limited routing
- Python/Node Lambdas for all logic & endpoints
- SNS/SQS for all events and dispatches
- REST API or SQS in
- SQS out

These three options represent a wide set of possible architectures by category. The most traditional approach would be the most straightforward to discuss, test, operate, budget, and audit as a platform while the fully-cloud platform would be the easiest to scale up to accommodate large volume, and to add on additional functionality that may not be core system’s design, such as specialized logging or A/B testing of algorithms, product hardware, etc. The hybrid approach would attempt to bridge the gap with the strong points of each. 

One potential drawback of heavy reliance on cloud architecture is vendor lock-in. While major cloud platforms largely have feature parity, switching providers - itself a very unlikely event - would be costly and time consuming.

## Coding Challenge

### Follow up steps/improvements
- Priority escalation  - tasks that have been waiting for a long time get elevated in priority
- Multiple cargos? Given a robot going from A -> D
  - it could pick up something at B and deliver it to C along the way
  - It could pick up something at B, complete original delivery to D, and then fulfill second delivery to F
- Intentionally ignore a task when nearby robot is almost done instead of calling a far away robot 
