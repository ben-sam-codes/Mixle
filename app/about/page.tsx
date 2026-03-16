import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Mixle — How to Play the Daily Word Puzzle",
  description:
    "Learn how Mixle works: get 9 letters, build your best word, carry unused letters forward across 3 rounds. Free daily word game with Scrabble-style scoring.",
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <Link href="/" className="about-logo">
          Mixle
        </Link>
      </div>

      <div className="about-content">
        <h1>A daily word puzzle that rewards your best thinking</h1>
        <p>
          Mixle is a free daily word game. Each day you get 9 letters and one
          goal: build the highest-scoring word you can. Use all 9 for a bonus,
          or play it safe with a shorter word — but whatever you don&apos;t use
          carries over to the next round. Think Scrabble strategy meets the
          daily ritual of Wordle, with a twist that makes every decision matter.
        </p>
        <p>
          No app to download. No account to create. Just open mixle.fun and
          play.
        </p>

        <h2>How Mixle works</h2>
        <p>
          Every puzzle starts with the same 9 letters for every player. Tap
          letters to spell a word, then submit it for Scrabble-style points.
          Longer words and uncommon letters earn more. Use all 9 letters and you
          get a bonus.
        </p>
        <p>
          Here&apos;s the catch: any letters you don&apos;t use carry over to
          the next round, mixed in with fresh letters to fill back up to 9. That
          means your choices echo forward — a greedy short word now might leave
          you stuck later. Three rounds, cumulative scoring.
        </p>
        <p>
          A new puzzle goes live every day at midnight. It takes about five
          minutes to play, which makes it easy to fit into a morning coffee, a
          lunch break, or a commute.
        </p>

        <h2>What makes it different from Wordle</h2>
        <p>
          Wordle asks you to guess a hidden word. Mixle asks you to build
          something. There&apos;s no binary right-or-wrong moment — you&apos;re
          optimizing, not guessing. Every valid word scores points, so every
          game feels productive even if you don&apos;t hit a perfect run.
        </p>
        <p>
          The carry-over mechanic adds a layer of strategy that Wordle
          doesn&apos;t have. Do you use 5 letters for a solid word and carry 4
          forward? Or go for the 9-letter anagram and the bonus? If you&apos;ve
          ever wished Wordle had more depth, or that Scrabble didn&apos;t
          require an hour and an opponent, Mixle sits right in between.
        </p>

        <h2>A daily game for word lovers</h2>
        <p>
          Mixle belongs to the growing family of daily puzzle games — alongside
          Wordle, Connections, Spelling Bee, and others — that give you one
          small challenge per day. The daily format keeps things fresh without
          becoming a time sink. Play once, share your score, come back tomorrow.
        </p>
        <p>
          The shared puzzle means everyone gets the same 9 letters on the same
          day, so you can compare strategies with friends without spoiling
          anything.
        </p>

        <h2>Play free, right in your browser</h2>
        <p>
          Mixle is completely free and works in any modern browser — phone,
          tablet, or desktop. There&apos;s nothing to install, no sign-up form,
          and no ads interrupting your game. Just the puzzle.
        </p>
        <p>
          New puzzle every day at midnight. See what you can build with
          today&apos;s letters.
        </p>

        <Link href="/" className="about-play-btn">
          Play today&apos;s puzzle &rarr;
        </Link>
      </div>
    </div>
  );
}
