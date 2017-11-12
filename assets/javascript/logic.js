 
$(document).ready(function() {
  // Initialize Firebase
	var config = {
  	apiKey: "AIzaSyDEuPV_lRVJwT7Revku-rRBuRupZ1dB_tM",
  	authDomain: "train-scheduler-6329e.firebaseapp.com",
  	databaseURL: "https://train-scheduler-6329e.firebaseio.com",
  	projectId: "train-scheduler-6329e",
  	storageBucket: "train-scheduler-6329e.appspot.com",
  	messagingSenderId: "904116934815"
  	};
  	firebase.initializeApp(config);

	var database = firebase.database();


	$('#submit-button').on('click', function(event){
		event.preventDefault();

		

		var trainName = $('#train-input').val().trim();
		var trainDestination = $('#destination-input').val().trim();
		var trainTime = $('#time-input').val().trim();
		var trainFrequency = $('#frequency-input').val().trim();

		var newTrain = {
			trainName:trainName,
			destination: trainDestination,
			time:trainTime,
			frequency:trainFrequency,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		}

		database.ref().push(newTrain);

		console.log(newTrain.trainName);
		console.log(newTrain.destination);
		console.log(newTrain.time);
		console.log(newTrain.frequency);

		$('#train-input').val("");
		$('#destination-input').val("");
		$('#time-input').val("");
		$('#frequency-input').val('');



		return false;
	});

	// database.ref().once("value", function(snapshot) {
	// 	snapshot.forEach(function(child){
	// 	createTable(child.val());
	// });
	// });
  	//take the value from the firebase database and appends it to the screen
	database.ref().on('child_added', function(childSnapshot, prevChildKey){

	  	console.log(childSnapshot.val());


	  	var trainName = childSnapshot.val().trainName;
	  	var trainDestination = childSnapshot.val().destination;
	  	var trainTime = childSnapshot.val().time;
	  	var trainFrequency = childSnapshot.val().frequency;

	  	console.log(trainName);
	  	console.log(trainDestination);
	  	console.log(trainTime);
	  	console.log(trainFrequency);


	  	function nextArrival(){

			// First Time (pushed back 1 year to make sure it comes before current time)  
			var firstTimeCoverted = moment(trainTime, "hh:mm").subtract(1, 'years');
			console.log(firstTimeCoverted);

			//Current Time
			var currentTime = moment();
			console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:'));

			//difference between the times
			var diffTime = moment().diff(moment(firstTimeCoverted), "minutes");

			// Time apart (remainder)
			var tRemainder = diffTime % trainFrequency;
			console.log(tRemainder);

			//minutes until Train
			var tMinutesTillTrain = trainFrequency - tRemainder;
			console.log('MINUTES TIL TRAIN: ' + tMinutesTillTrain);

			//Next Train
			var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
			console.log('ARRIVAL TIME: ' + moment(nextTrain).format('HH:mm'));

			return moment(nextTrain).format('HH:mm');
		}

		function minutesAway(){
	
			 // First Time (pushed back 1 year to make sure it comes before current time)
			 var firstTimeCoverted = moment(trainTime, "hh:mm").subtract(1, 'years');
			 console.log(firstTimeCoverted);

			//Current Time
			var currentTime = moment();
			console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:'));

			//difference between the times
			var diffTime = moment().diff(moment(firstTimeCoverted), "minutes");

			// Time apart (remainder)
			var tRemainder = diffTime % trainFrequency;
			console.log("difftime is " + diffTime + " frequency is " + trainFrequency);
			console.log("time remaining is " + tRemainder);

			//minutes until Train
			var tMinutesTillTrain = trainFrequency - tRemainder;
			console.log('MINUTES TIL TRAIN: ' + tMinutesTillTrain);

			return tMinutesTillTrain;
		}

		var scheduleDiv = $('<tr>')
		scheduleDiv.append($('<td>'+ trainName + '</td>'))
		scheduleDiv.append($('<td>'+ trainDestination + '</td>'))
		scheduleDiv.append($('<td>'+ trainFrequency + '</td>'))
		scheduleDiv.append($('<td>'+ nextArrival() + '</td>'))
		scheduleDiv.append($('<td>'+ minutesAway() + '</td>'))

		$('#trainTable').append(scheduleDiv);

		});

});