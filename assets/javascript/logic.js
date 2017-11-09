 
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
  var trainName;
  var destination;
  var time;
  var frequency;


  //take the value from the firebase database and appends it to the screen
  database.ref().on('value', function(snapshot){
  	if(snapshot.child('trainName').exists() && snapshot.child('destination').exists()
  		&& snapshot.child('time').exists() && snapshot.child('frequency').exists())
  	{

  		trainName = snapshot.val().trainName;
  		destination = snapshot.val().destination;
  		time = snapshot.val().time;
  		frequency = snapshot.val().frequency;
  		console.log("firebase frequency is " + frequency)
  		
  		//currently this just appends to the table but does not make a new row
  		//to be updated
 
  		var scheduleDiv = $('<th>')
  		// console.log(trainName);
  		var trainDiv = $('<td>').text(trainName);
  		var timeDiv = $('<td>').text(time);
  		var destinationDiv = $('<td>').text(destination);
  		var frequencyDiv = $('<td>').text(frequency);
  		var arrivalDiv = $('<td>').text(nextArrival());
  		var minutesAwayDiv = $('<td>').text(minutesAway());
  		scheduleDiv.append(trainDiv);
  		scheduleDiv.append(destinationDiv);
  		scheduleDiv.append(frequencyDiv);
  		scheduleDiv.append(arrivalDiv);
  		scheduleDiv.append(minutesAwayDiv);
  		$('#trainTable').append(scheduleDiv);

  	}
  });

   // // Assumptions
    
   //  // Time is 3:30 AM
   //  var firstTime = "03:30";


   function nextArrival(){
	 // First Time (pushed back 1 year to make sure it comes before current time)
   
	var firstTimeCoverted = moment(time, "hh:mm").subtract(1, 'years');
	console.log(firstTimeCoverted);

	//Current Time
	var currentTime = moment();
	console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:'));

	//difference between the times
	var diffTime = moment().diff(moment(firstTimeCoverted), "minutes");

	// Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log(tRemainder);

	//minutes until Train
	var tMinutesTillTrain = frequency - tRemainder;
	console.log('MINUTES TIL TRAIN: ' + tMinutesTillTrain);

	//Next Train
	var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
	console.log('ARRIVAL TIME: ' + moment(nextTrain).format('HH:mm'));

	return moment(nextTrain).format('HH:mm');
}

   function minutesAway(){
	 // First Time (pushed back 1 year to make sure it comes before current time)
   
	var firstTimeCoverted = moment(time, "hh:mm").subtract(1, 'years');
	console.log(firstTimeCoverted);

	//Current Time
	var currentTime = moment();
	console.log('CURRENT TIME: ' + moment(currentTime).format('hh:mm:'));

	//difference between the times
	var diffTime = moment().diff(moment(firstTimeCoverted), "minutes");

	// Time apart (remainder)
	var tRemainder = diffTime % frequency;
	console.log("difftime is " + diffTime + " frequency is " + frequency);
	console.log("time remaining is " + tRemainder);

	//minutes until Train
	var tMinutesTillTrain = frequency - tRemainder;
	console.log('MINUTES TIL TRAIN: ' + tMinutesTillTrain);

	// //Next Train
	// var nextTrain = moment().add(tMinutesTillTrain, 'minutes');
	// console.log('ARRIVAL TIME: ' + moment(nextTrain).format('hh:mm'));

	return tMinutesTillTrain;
}



//submit button takes the field input, trims, then sends to the database
$('#search-button').on('click', function(){
	trainName = $('#train-input').val().trim();
	destination = $('#destination-input').val().trim();
	time = $('#time-input').val().trim();
	frequency = $('#frequency-input').val().trim();

	console.log('button is clicked');

	console.log(trainName);
	console.log(destination);
	console.log(time);
	console.log(frequency);

	database.ref().set({
		trainName:trainName,
		destination:destination,
		time:time,
		frequency:frequency,

	});



	return false;
});




// attempting to add rows dynamically  		addRow();
//  function addRow(trainTable) {
//     var table = document.getElementById(trainTable);
//     var rowCount = table.rows.length;
//     var colCount = table.rows[0].cells.length;    
//     var validate_Noof_columns = (colCount - 1); // •No Of Columns to be Validated on Text.
//     for(var j = 0; j < colCount; j++) { 
//         var text = window.document.getElementById('input'+j).value;

//         if (j == validate_Noof_columns) {
//             row = table.insertRow(2); // •location of new row.
//             for(var i = 0; i < colCount; i++) {       
//             var text = window.document.getElementById('input'+i).value;
//             var newcell = row.insertCell(i);
//                 if(i == (colCount - 1)) {  // Replace last column with delete button
//     newcell.innerHTML = "<INPUT type='button' value='X' onclick='removeRow(this)'/>"; break;
//                 } else  {
//                     newcell.innerHTML = text;
//                     window.document.getElementById('input'+i).value = '';
//                 }
//             }   
//         }else if (text != 'undefined' && text.trim() == ''){ 
//             alert('input'+j+' is EMPTY');break;
//         }  
//     }   
// }





});