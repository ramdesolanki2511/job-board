import { api } from "./api/client";

async function main() {
  const response = await api.get("/jobs");

  console.log(response.data);
}

main();