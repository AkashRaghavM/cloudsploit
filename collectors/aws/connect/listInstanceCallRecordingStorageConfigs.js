var AWS = require('aws-sdk');
var async = require('async');

module.exports = function(AWSConfig, collection, callback) {
    var connect = new AWS.Connect(AWSConfig);

    async.eachLimit(collection.connect.listInstances[AWSConfig.region].data, 15, function(instance, cb){
        collection.connect.listInstanceCallRecordingStorageConfigs[AWSConfig.region][instance.Id] = {};
        var params = {
            'InstanceId': instance.Id,
            'ResourceType': 'CALL_RECORDINGS'
        };

        connect.listInstanceStorageConfigs(params, function(err, data) {
            if (err) {
                collection.connect.listInstanceCallRecordingStorageConfigs[AWSConfig.region][instance.Id].err = err;
            }
            collection.connect.listInstanceCallRecordingStorageConfigs[AWSConfig.region][instance.Id].data = data;
            cb();
        });
    }, function(){
        callback();
    });
};
