const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host:keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

// Not optimal approach to calculate fib
function fib(index){
    let res;

    if(index < 2 ){
        res= 1;
    }else{
        res = fib(index-1) + fib(index -2);
    }

    return res;
}

sub.on('message',(channel,message)=> {
    redisClient.hset('values',message,fib(parseInt(message)));
});

sub.subscribe('insert');