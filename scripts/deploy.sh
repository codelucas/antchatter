

/bin/sh ~/webapps/antchatter/scripts/collectstatic.sh

echo 'finished collecting static files'

~/webapps/antchatter/bin/stop
~/webapps/antchatter/bin/start

echo 'finished redeploying'
