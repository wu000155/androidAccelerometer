/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    deviceReadyCounter: 0,
    watchID: null,
    options: {
        frequency: 300
    },
    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('DOMContentLoaded', app.onDeviceReady, false);
    },

    onDeviceReady: function () {
        app.deviceReadyCounter++;
        //when deviceready and DOMContentLoaded are both ready, run rest function
        if (app.deviceReadyCounter == 2) {
            app.receivedEvent('deviceready');
            //deal with resume and pause App lifecycle
            document.addEventListener("resume", app.onResume, false);
            document.addEventListener("pause", app.onPause, false);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var submitBtn = parentElement.querySelector('#submitBtn');

        listeningElement.setAttribute('style', 'display:none;');
        submitBtn.setAttribute('style', 'display:block;');
        // show submit Btn to users
        //add FastClick library to remove 300ms click event on device
        FastClick.attach(submitBtn);
        // add click event on submit Btn to execute sendAccelerometerData function
        submitBtn.addEventListener('click', app.sendAccelerometerData);
        app.getAccelerometer();
    },
    getAccelerometer: function () {
        //use cordova/phonegap accelerometer plugin to access device accelerometer
        // watchAcceleration and set global variable watchId
        app.watchID = navigator.accelerometer.watchAcceleration(app.onSuccess, app.onError , app.options);
       //global variable options set watch Acceleration every 300ms
    },
    onSuccess: function (acceleration) {
        // when watchAcceleration success, display data on device screen
        document.querySelector('.accelerationX').innerHTML = "X: "+acceleration.x;
        document.querySelector('.accelerationY').innerHTML = "Y: "+acceleration.y;
        document.querySelector('.accelerationZ').innerHTML = "Z: "+acceleration.z;
    },
    sendAccelerometerData: function () {
        // get text from screen
        var accelerationX = document.querySelector('.accelerationX').innerHTML;
        var accelerationY = document.querySelector('.accelerationY').innerHTML;
        var accelerationZ = document.querySelector('.accelerationZ').innerHTML;
        var xArray=  accelerationX.split(' ');
        var yArray=  accelerationY.split(' ');
        var zArray=  accelerationZ.split(' ');
        var x=xArray[1];
        var y=yArray[1];
        var z=zArray[1];
         //split text from "x: 0331232132"
        
        var strUrl = "http://www.octapex.com/codingtest/submit.php";
       
        if (x!=null && y!=null && z!=null) {
           
             //XMLHttpRequest error preservation
            var postData = new FormData();
            
            postData.append('x', x);
            postData.append('y', y);
            postData.append('z', z);
            postData.append('name', "Yi Wu");
            // append three values to formData
            var request = new XMLHttpRequest();
            request.open('POST', strUrl, true);
            // open XMLHttpRequest using POST method and async parameter is true
            request.onreadystatechange = function () {
                if (request.readyState === 4 || request.readyState == "complete") {
                    //check if request finished and response is ready
                    
                    if (request.status === 200 || request.status === 0) {
                     //check if status is ok
                        
                        
                        if(request.responseText==1){
                            //show alert to users
                            alert('submit success');
                        }else{
                            alert('submit fail');
                        }

                    } else {

                        alert('error: '+request.status);
                    }
                }

            }
            request.send(postData);
//            send data
        }
    },
    onError: function () {
        console.log('can not get your accelerometer!');
    },
    onPause: function () {
        // when app lifecycle is onPause, stop watching to save device battery
        navigator.accelerometer.clearWatch(app.watchID);
        app.watchID = null;
        
    },
    onResume: function () {
    // when app is onResume, continue watching the accelerometer
        app.watchID = navigator.accelerometer.watchAcceleration(app.onSuccess, app.onError, app.options);
        console.log(app.watchID);
    },
};

app.initialize();