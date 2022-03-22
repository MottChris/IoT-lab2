var firebase = require('firebase/app');
var nodeimu = require('@trbll/nodeimu')
var IMU = new nodeimu.IMU();
var sense = require('@trbll/sense-hat-led');

const { getDatabase, ref, onValue, set, update, DataSnapshot, get } = require('firebase/database');
const { initializeApp } = require('firebase/app')

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCq0x9CXR2iUyTL5FLAf4uDbacRG4Hod94",
  authDomain: "mott-teg-iot-lab2.firebaseapp.com",
  projectId: "mott-teg-iot-lab2",
  storageBucket: "mott-teg-iot-lab2.appspot.com",
  messagingSenderId: "68991219741",
  appId: "1:68991219741:web:41be45b5abcddc04bceef4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
// console.log(db);

// initialize the database with starting values
function initializeDB() {
  const db = getDatabase();
  set(ref(db, 'sensors/'), {
    "temperature"     : 0.0,
    "humidity"        : 0.0,
    "light_row"       : 0,
    "light_col"       : 0,
    "light_r"         : 0,
    "light_g"         : 0,
    "light_b"         : 0,
    "update_light"    : false
  });
}

// update ONLY temperature and humidity values in firebase. This function is used in the 5 second interval callback ish
function updateSensorData() {
    const db = getDatabase();
    var data = IMU.getValueSync();

    update(ref(db, 'sensors/'), {
      "temperature" : data.temperature.toFixed(4),
      "humidity"    : data.humidity.toFixed(4),
    })

    // set(ref(db, 'sensors/'), {
    //   "temperature"     : data.temperature.toFixed(4),
    //   "humidity"        : data.humidity.toFixed(4),
    // });
    console.log("Temperature & Humidity updated in firebase")
}

// call back for any time the update_light boolean value is changed from false to true
const updateLightRef = ref(db, 'sensors/update_light')
onValue(updateLightRef, (DataSnapshot) => {
  console.log("update_light callback fired up fo")
  const data = DataSnapshot.val();
  console.log(data)

  // get data and ensure it is atomic
  const db = getDatabase();
  get(ref(db, 'sensors/')).then((snapshot) => {
    
    console.log(snapshot.val());
    const data = snapshot.val()
    // set led lights
    console.log(data.light_row)
    console.log(data.light_col)
    console.log(data.light_r)
    console.log(data.light_g)
    console.log(data.light_b)
    sense.setPixel(data.light_row, data.light_col, [data.light_r, data.light_g, data.light_b])
  })

  // set led lights with sensor data

  // return updated light value to false
  update(ref(db, 'sensors/'), {
    'update_light' : false
  })
});

// BEGIN APP LOGIC HERE
sense.clear()
initializeDB();

var interval = setInterval(updateSensorData, 5000)