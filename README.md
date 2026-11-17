# Wakekeeper — Rescue the Ring

[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/Mlnglh889/wakekeeper-orbital-rescue-20261116/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/Mlnglh889/wakekeeper-orbital-rescue-20261116/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

A small rescue ship, a gravity well, and eighteen stranded passengers. Wakekeeper is an original offline browser game about planning a safe path through four orbital sectors, trading fuel against momentum, and returning passengers to a home relay.

## Play locally

Requires a current desktop browser and Python 3 to serve the static files:

```sh
python3 -m http.server 8080 --directory game
```

Open http://localhost:8080. The game needs no installation, build step, account, or runtime network access.

WASD or arrows thrust in a direction. Holding the mouse thrusts toward the cursor. Shift brakes; Space boosts; P pauses; M toggles synthesized audio. Approach SOS pods below 180 speed, then carry them back to the golden home relay. The relay refills fuel. Rescue all passengers in all four sectors before their windows close. Cargo adds mass. The gold dotted path predicts the ship's unpowered flight under the same gravity model used by the simulation. Permanent retrofits improve thrust, capacity, rescue range, or armor between sectors.

## Artifact

Node 22.18+ and its standard library produce the submission artifact:

```sh
MAKEFUN_OUTPUT_DIR=out node main.ts
```

The entrypoint copies the exact offline game and genuine browser screenshots, then calls the unchanged kit library at `vendor/makefun-game.ts` to produce `dossier.json`. All game artwork and sound are procedural original work. No external game engine, commercial assets, fonts, or network services are loaded.

## Expedition progress

Each completed sector saves a passage record and a checkpoint before the next retrofit. Open Rescue chart from the title to review records or continue that checkpoint after a reload. A new expedition clears the checkpoint while keeping sector bests. Cinder Meridian adds a moving front that is safe below 90 speed; the Quiet Maw adds gravity tides; Dawn Relay supplies two single-use fuel cells. Flight HUD, audio cues, particle bursts, and the coast prediction give immediate feedback.

## Source map

- `game/src/main.js`: UI states, fixed-step loop, score persistence and input commands.
- `game/src/simulation.js`: rescue, cargo, docking, collision, fuel, time windows and progression conditions.
- `game/src/input.js`: controls, gravity integrator and coast prediction.
- `game/src/state.js`: four authored sector layouts and permanent retrofits.
- `game/src/render.js`: astronomical navigation chart, procedural planet, ship, pods, debris and particles.
- `game/src/audio.js`: original WebAudio tones and sparse ambient score.
- `game/src/sector-effects.js`: cinder speed gate, gravity tide and final-sector supplies.
- `game/src/save.js`: completed-passage records and checkpoint persistence.
- `game/src/route-chart.js`: progress chart and passage-result tables.

MIT licensed.

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-game-01) · AI agents build software for cash rewards</sub>
