/*
	Diligent Robotics Mock Scheduler
	K.Sanders April 2022

	Proof of concept for scheduling tasks
*/


class DRScheduler
{

	robotFleet = [];
	idleRobots = 0;
	tasksHigh = [];
	tasksMed = [];
	tasksLow = [];
	gameWorld;

	constructor(numRobots){
		this.gameWorld = new GamePhysics();
		for(var i=0; i<numRobots; i++)
		{
			// Assume new setup w/ all at start of hallway 
			this.robotFleet.push(new DRRobot(i, this.gameWorld, 1)); 
			this.idleRobots++;
		}
	}

	checkForIdleRobots()
	{
		console.log("Checking for Idle Robots");
		console.log(this.robotFleet);
		if(this.idleRobots) {
			for(var i=0; i<this.idleRobots; i++) {
				this.workTasks();
			}
		}
	}

	pushTask(task)
	{
		if(task.priority == 1) {
			this.tasksHigh.push(task);
		} else if(task.priority == 2) {
			this.tasksMed.push(task);
		} else if(task.priority == 3) {
			this.tasksLow.push(task);
		}
	}

	workTasks()
	{
		if(this.idleRobots>0){
			var h = this.tasksHigh.length;
			var m = this.tasksMed.length;
			var l = this.tasksLow.length;
			console.log("Fetching new task! [" +
				" H:"+ h +
				" M:"+ m +
				" L:"+ l + "]");

			if(h) {
				var task = this.tasksHigh.shift();
				this.schedule(task.pickupRoom, task.deliveryRoom);
			} else if(m) {
				var task = this.tasksMed.shift();
				this.schedule(task.pickupRoom, task.deliveryRoom);
			} else if (l) {
				var task = this.tasksLow.shift();
				this.schedule(task.pickupRoom, task.deliveryRoom);
			} else {
				console.log("All tasks complete");
			}
		}
	}

	schedule(pickupRoom, deliveryRoom)
	{
		var self = this;
		this.idleRobots--;
		console.log("Scheduling robot, inactive fleet: "+this.idleRobots);
		var r = this.findBestRobot(pickupRoom);
		//todo: is running instantly, not waiting
		r.workDispatch(pickupRoom, deliveryRoom);
		this.idleRobots++; 
	}

	findBestRobot(pickupRoom)
	{
		var bestDistance = Number.POSITIVE_INFINITY;
		var bestRobot = null;
		
		for(var i=0; i<this.robotFleet.length; i++)
		{
			var r = this.robotFleet[i];
			// look for robots in standby mode 
			if(r.standby) {
				// look for the closest one
				var rDistance = this.gameWorld.calculateDistance(pickupRoom, r.currentRoom);
				if(rDistance < bestDistance) {
					bestDistance = rDistance;
					bestRobot = r;
				}
			}
		}

		return bestRobot;
	}

}

class DRRobot
{
	id;
	currentRoom;
	standby = true;
	world;

	constructor(id, world, startingRoom){
		this.id = (id+1)*11;
		this.world = world;
		this.currentRoom = startingRoom;
	}

	workDispatch(pickupRoom, deliveryRoom){
		this.standby = false;
		var world = this.world;
		world.navigateTravel(
			world.calculateDistance(this.currentRoom, pickupRoom)
			)
		.then(world.PickUpOrDelivery())
		.then(world.navigateTravel(
			world.calculateDistance(pickupRoom, deliveryRoom)
			))
		.then(world.PickUpOrDelivery())
		.then(this.completeRun(deliveryRoom))
	}

	completeRun(destination)
	{
		this.currentRoom = destination;
		this.standby = true;
	}
}


class GamePhysics
{
	travelTimePerRoom = 1000;
	transactionTime = 500;

	navigateTravel(r) {
	  return new Promise(resolve => {
	    setTimeout(() => {
	      resolve();
	    }, (r*this.travelTimePerRoom)); 
	  });
	}

	PickUpOrDelivery() {
	  return new Promise(resolve => {
	    setTimeout(() => {
	      resolve();
	    }, this.transactionTime); 
	  });
	}

	calculateDistance(room1, room2)
	{
		return Math.abs(room1 - room2);
	}
}


// Assume single hallway of rooms 
class HospitalMap {
	constructor(numRooms){
		this.rooms = [];
		for(var i=1; i<=numRooms; i++){
			this.rooms.push(i);
		}
	}
}


let hospWing = new HospitalMap(10);
let drs = new DRScheduler(3);

//check for idling robots every second
setInterval(function(){
	drs.checkForIdleRobots();
}, 1000); 

setInterval(function(){
	drs.pushTask({
		priority: getRandomInt(1,3),
		pickupRoom: getRandomInt(1,10),
		deliveryRoom: getRandomInt(1,10)
	});
}, 700); 

// console.log(hospWing);
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

