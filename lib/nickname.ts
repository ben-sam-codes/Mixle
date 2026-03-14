const ADJECTIVES = [
  "adventurous", "bold", "brave", "bubbly", "calm", "charming", "cheerful",
  "clever", "cosmic", "crafty", "curious", "daring", "dazzling", "dreamy",
  "eager", "fancy", "fearless", "fluffy", "friendly", "generous", "gentle",
  "gleaming", "glorious", "graceful", "groovy", "happy", "heroic", "honest",
  "jolly", "joyful", "keen", "kind", "lively", "lucky", "majestic", "mellow",
  "mighty", "nimble", "noble", "peaceful", "playful", "plucky", "polite",
  "quirky", "radiant", "regal", "sensible", "serene", "silly", "snappy",
  "sparkly", "spirited", "stellar", "sturdy", "swift", "tender", "thoughtful",
  "thrifty", "tidy", "valiant", "vibrant", "vivid", "whimsical", "wild",
  "witty", "wonderful", "zany", "zealous", "zippy",
];

const ANIMALS = [
  "alpaca", "badger", "bear", "bunny", "capybara", "cat", "chameleon",
  "corgi", "coyote", "crane", "deer", "dolphin", "duck", "eagle", "falcon",
  "flamingo", "fox", "frog", "giraffe", "hamster", "hawk", "hedgehog",
  "hippo", "hummingbird", "jaguar", "koala", "lemur", "lion", "llama",
  "lynx", "moose", "narwhal", "octopus", "otter", "owl", "panda",
  "parrot", "peacock", "penguin", "puffin", "quail", "rabbit", "raccoon",
  "raven", "seal", "sloth", "sparrow", "squid", "tiger", "toucan",
  "turtle", "walrus", "wombat", "zebra",
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function generateNickname(): string {
  const seed = Date.now().toString() + Math.random().toString();
  const h = simpleHash(seed);
  const adj1 = ADJECTIVES[h % ADJECTIVES.length];
  const adj2 = ADJECTIVES[(h * 7 + 13) % ADJECTIVES.length];
  const animal = ANIMALS[(h * 31 + 47) % ANIMALS.length];
  return `${adj1}-${adj2}-${animal}`;
}

export function generatePlayerId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const NICKNAME_KEY = "mixle-nickname";
const PLAYER_ID_KEY = "mixle-player-id";

export function getNickname(): string | null {
  try {
    return localStorage.getItem(NICKNAME_KEY);
  } catch {
    return null;
  }
}

export function setNickname(name: string): void {
  try {
    localStorage.setItem(NICKNAME_KEY, name);
  } catch {}
}

export function getPlayerId(): string {
  try {
    let id = localStorage.getItem(PLAYER_ID_KEY);
    if (!id) {
      id = generatePlayerId();
      localStorage.setItem(PLAYER_ID_KEY, id);
    }
    return id;
  } catch {
    return generatePlayerId();
  }
}
