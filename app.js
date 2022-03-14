var firebase = require('firebase/app');
var nodeimu = require('@trbll/nodeimu')
var IMU = new nodeimu.IMU();
var sense = require('@trbll/sense-hat-led');

const { getDatabase, ref, onValue, set, update } = require('firebase/database');
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

const database = getDatabase();
console.log(database);

function writeSensorData(temp, humidity, light_row, light_col, light_r, light_g, light_b, update_light) {
    const db = getDatabase();
    set(ref(db, 'sensors/'), {
      "temperature"     : temp,
      "humidity"        : humidity,
      "light_row"       : light_row,
      "light_col"       : light_col,
      "light_r"         : light_r,
      "light_g"         : light_g,
      "light_b"         : light_b,
      "update_light"    : update_light
    });

    


}


writeSensorData(0,0,0,0,0,0,0,0);