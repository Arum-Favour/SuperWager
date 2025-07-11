"use server";

import axios from "axios";
import { base_url } from "./utils";

export async function fetchMatches(
  season_id: string
): Promise<SportEventSchedule> {
  const res = await axios.get(
    `${base_url}/api/fetch-matches?season_id=${season_id}`
  );
  return res.data;
}

export async function fetchOdds(tournament_id: string): Promise<SportOddsData> {
  const res = await axios.get(
    `${base_url}/api/fetch-odds?tournament_id=${tournament_id}`
  );
  return res.data;
}
