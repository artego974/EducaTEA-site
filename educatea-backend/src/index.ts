import "dotenv/config";
import { AppDataSource } from "./data-source";
import app from "./app";

const PORT = Number(process.env.PORT) || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Banco de dados conectado.");
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Falha ao conectar ao banco de dados:", err);
    process.exit(1);
  });
