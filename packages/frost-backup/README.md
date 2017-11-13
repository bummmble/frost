# Frost Backup

> An extremely simple ecnrypted and compressed backup to Amazon S3 for MongoDB/Redis 

## Usage

### Redis Permission Requirements

The user running the CLI or interacting with the API needs permission to access your Redis database backup file path.

> Note that if you have changed the paths below from the defaults then you will need to adjust the below

* Mac: If you installed Redis with 'brew install redis' and have the default permissions, you're good out of the box!

* Ubuntu: Run the following commands, replacig 'user' with your currently logged in username (type 'whoami' to discover this)

```sh
sudo adduser user redis
sudo chown -R redis:redis /etc/redis
sudo chown -R redis:redis /var/lib/redis
sudo chmod g+wr /etc/redis/redis.conf
sudo chmod g+wr /var/lib/redis/dump.rdb
```
