const dbUser = "fabriciorioslopes"; // Coletar usuário do DB
const dbPass = "fabrios12361236"; // Coletar senha do DB
const dbName = "dbLiderMadeiras"; // Coletar nome do DB

export default {
  port: 4000,
  // Mudar aqui a conexão do banco
  dbUri: `mongodb+srv://${dbUser}:${dbPass}@cluster0.zmaydic.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  env: "development",
};
