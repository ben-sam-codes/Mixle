import { supabase } from "./supabase";

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  rounds_completed: number;
}

export async function submitScore(
  playerId: string,
  nickname: string,
  score: number,
  dayNumber: number,
  roundsCompleted: number
): Promise<void> {
  if (!supabase) return;
  await supabase.from("scores").upsert(
    {
      player_id: playerId,
      nickname,
      score,
      day_number: dayNumber,
      rounds_completed: roundsCompleted,
    },
    { onConflict: "player_id,day_number" }
  );
}

export async function getLeaderboard(
  dayNumber: number
): Promise<LeaderboardEntry[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("scores")
    .select("nickname, score, rounds_completed")
    .eq("day_number", dayNumber)
    .order("score", { ascending: false })
    .limit(50);
  return (data as LeaderboardEntry[]) || [];
}

export async function getPlayerRank(
  playerId: string,
  dayNumber: number
): Promise<{ rank: number; total: number } | null> {
  if (!supabase) return null;

  // Get player's score
  const { data: playerData } = await supabase
    .from("scores")
    .select("score")
    .eq("player_id", playerId)
    .eq("day_number", dayNumber)
    .single();

  if (!playerData) return null;

  // Count how many scored higher
  const { count: higherCount } = await supabase
    .from("scores")
    .select("*", { count: "exact", head: true })
    .eq("day_number", dayNumber)
    .gt("score", playerData.score);

  // Count total players
  const { count: totalCount } = await supabase
    .from("scores")
    .select("*", { count: "exact", head: true })
    .eq("day_number", dayNumber);

  return {
    rank: (higherCount || 0) + 1,
    total: totalCount || 0,
  };
}

export async function updateNickname(
  playerId: string,
  newNickname: string
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("scores")
    .update({ nickname: newNickname })
    .eq("player_id", playerId);
}
