# to-do-list-app
Usage:
```
cd to-do-list-app
yarn install
yarn start
```
NOTE: Don't forget to change <your-db-adress-here> with your database's adress.

(Optional) Setup a local json server for database:

Install JSON Server: ```npm install -g json-server```

Create a db.json such as:
```
{
  "todos": []
}
```

Then run JSON Server:
```
json-server --watch db.json
```

If you want to access it from the other devices in your local network:
```
json-server --watch db.json -H 192.168.0.XXX (XXX can be 100, 101, etc., for windows: cmd->ipconfig->ipv4 address)
```
