#!/bin/bash
 
LOCKFILE=/tmp/mongo_antchatter.txt
if [ -e ${LOCKFILE} ] && kill -0 `cat ${LOCKFILE}`; then
    echo "Mongodb for antchatter already running"
    exit
fi
 
# make sure the lockfile is removed when we exit and then claim it
trap "rm -f ${LOCKFILE}; exit" INT TERM EXIT
echo $$ > ${LOCKFILE}

$HOME/webapps/mongodb_antchatter/mongodb-linux-x86_64-2.4.8/bin/mongod \
--auth --dbpath $HOME/webapps/mongodb_antchatter/data/ --port 21027

sleep 1
 
rm -f ${LOCKFILE}
