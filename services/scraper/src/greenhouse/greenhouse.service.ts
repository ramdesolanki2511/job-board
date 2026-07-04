import axios from "axios";

import { GreenhouseJob } from "./greenhouse.types";

export class GreenhouseService {
  async getJobs(boardToken: string) {
    const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs`;

    const response = await axios.get(url);

    return response.data.jobs as GreenhouseJob[];
  }
}
