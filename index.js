var aws = require('aws-sdk');
var s3 = new aws.S3();

var BUCKET = "BUCKET_NAME";
var URL_PREFIX = 'https://s3-ap-northeast-1.amazonaws.com/' + BUCKET + '/';

exports.handler = function (event, context, callback) {
    var hash = event.hash;
    var contentType = event.contentType;

    if (!hash) {
        callback('no set a file hash digest.');
        return;
    }

    if (!contentType) {
        callback('no set content type.');
        return;
    }

    var key;

    if (contentType.match(/(\.|\/)png$/i)) {
        key = hash + ".png";
    } else if (contentType.match(/(\.|\/)gif$/i)) {
        key = hash + ".gif";
    } else if (contentType.match(/(\.|\/)jpe?g$/i)) {
        key = hash + ".jpg";
    } else {
        callback('invalid content type (gif, jpg, or png)');
        return;
    }

    // console.log('Content-Type: ' + contentType);

    var params = {
        Bucket: BUCKET,
        Key: key,
        Body: '',
        ContentType: contentType,
        Expires: 60
    };
    s3.getSignedUrl('putObject', params, function (err, url) {
        if (err) {
            callback(err);
            return;
        }

        // console.log('SIgned-URL: ', url);

        callback(null, {
            'signedUrl': url,
            'imageUrl': URL_PREFIX + key
        });
    });
};
