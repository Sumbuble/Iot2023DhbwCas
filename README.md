# Node Red starten
docker run -ti -v $PWD/node_red_data:/data -p 1880:1880 --name nodered nodered/node-red

# Node.js Server starten
node ./server.js

