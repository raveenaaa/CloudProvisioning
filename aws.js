const AWS = require('aws-sdk');
const chalk = require('chalk');
const os = require('os');

var myRegion = 'us-east-2';
AWS.config.update(
    {
        region: myRegion, 
        accessKeyId: process.env.AWS_ID, 
        secretAccessKey: process.env.AWS_TOKEN
    });

function createInstance(){
    var instanceParams = {
        ImageId: "ami-0d520ac429fa80fe2",
        InstanceType: "t2.micro", 
        KeyName: 'AWS_KEY',
        MinCount: 1,
        MaxCount: 1
     };

    // Create a promise on an EC2 service object
    var instancePromise = new AWS.EC2({apiVersion: '2016-11-15'}).runInstances(instanceParams).promise();

    // Handle promise's fulfilled/rejected states
    instancePromise.then(
    function(data) {
        console.log(data);
        var instanceId = data.Instances[0].InstanceId;
        console.log("Created instance", instanceId);
    }).catch(
        function(err) {
        console.error(err, err.stack);
});
}

function getInstanceAddress(id) {
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15'});
    var params = {
        Filters:[{
            Name: 'instance-id',
            Values: [id]
        }]
       }; 
    ec2.describeInstances(params, function(err, data){
        if (err) console.log(err, err.stack);
        else 
        instances = data.Reservations[0].Instances;
        console.log("Public IP Address:", instances[0].PublicIpAddress);
        console.log("Public DNS Name:", instances[0].PublicDnsName);
    });
}

// 1. Creating an instance
// Uncomment to run. Do it just once.
// createInstance();

id = 'i-07b4fa250c1004e56'

// 2. Get the instance address
// Uncomment to run
getInstanceAddress(id)

