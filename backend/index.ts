import { app, server } from "./app";
import { ENV, PORT } from "./env";

app.listen(PORT, () => {
    console.log(`[server]: listening at http://localhost:${PORT} in ${ENV} mode`);
});


//for run server socket.io
server.listen(3001, () => {
    console.log(`[socket]: listening at http://localhost:3001 in ${ENV} mode`);
});