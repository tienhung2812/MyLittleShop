'use strict';
var crypto = require('crypto');

var CreateSalt = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(UsersPassword, Salt){
    var Hash = crypto.createHmac('sha512', Salt); /** Hashing algorithm sha512 */
    hash.update(UsersPassword);
    var FinalHash = Hash.digest('hex');
    return FinalHash;
};
