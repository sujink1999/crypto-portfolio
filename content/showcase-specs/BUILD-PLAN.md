# Showcase Rebuild Plan (v2 - pixel-perfect)

Specs: `beans.md`, `ovix.md`, `society.md` (verbatim CSS/assets/animations from production repos).
Rule: builders work from spec + copied files. v1 components are replaced wholesale.

## Beans - `/showcase/beans`
**Recreates:** the live-round "Domains → Spotlight → BeansRace" screen (not the FirstLaunch default render).
- Race arena (`#724324`) with green `beanGreen` "launch is live" badge, **two** `RunningBean` racers: random top/left offset every 1000ms over `transition-all duration-1000`, plus the `BeanRunningSVG` built-in animateTransform leg run.
- `StonerBeanActivity` bean pinned bottom-left (z-3) popping `PixDiv` speech bubbles cycling fake activity (5s window, real event→string mapping).
- `PixDiv`/`PixButton` pixel chrome for all cards, exact tailwind palette.
- Fonts: Roboto Mono (Google) + `Retro.ttf` copied from `beans-ui/public/fonts/` for `.font-number`.
- Assets: copy `props.js`/`svgs.js` exports used, `pixel-crown.png`, `coin-pile-*.png`, `sol-icon.png`. Optional `bean-song.mp3` behind a mute-default toggle.
- Fake feed scripted from `responseSamples.js` shapes.

## 0VIX - `/showcase/ovix`
**Recreates:** real `Home.tsx` dashboard - sticky header, stat/count row, two-column supply/borrow `AssetMarketSection` with expandable `AssetCard` rows - plus TransactionToast on top.
- Verbatim palette (card `#1B2127`, darkCard `#161B20`, purple `#967CC9`, chip `#242B33`, mcard translucents, backdrop-blur), `0vix-bg.png`, status-gradient CSS.
- Fonts: Outfit (body) + DM Sans via Google imports - no files.
- Toast: all 9 ToastStatus stages, three independently height-animated ExpandableBox panels re-measured via `refresh` counter (load-bearing), 8-dot spinner CSS, `extend-width` 5s progress fill, 5000ms auto-dismiss. Scripted loop w/ occasional error path.
- Data: the 11-token market table from the spec (ETH, WBTC, USDC, ... gDAI) with real-looking APY/LTV.

## Society - `/showcase/society`
**Recreates:** Home screen + streak detail in iPhone frame.
- Fonts: copy the 5 real Inter weight TTFs from `node_modules/@expo-google-fonts/inter/`, one @font-face per weight (no synthetic bolding).
- Type scale override: xl=18, base=15, sm=13, xs=11, 3xl=28 (from `constants/tw.ts`).
- Surfaces: pure `#000000` + rgba(255,255,255,0.0x) borders; GlassCard radial gradient for depth; 0.1em letter-spacing on uppercase micro-labels.
- Components per spec: HomeHeader, DateSelectorWidget (exact bar geometry), CharacterStateSection, beacon stack (STACK_CONFIG verbatim, swipe/settle animation), DaytimeTasksWidget, StreakDetail modal with spring config + count-up.
- Assets: 5 character PNGs + logo per copy list. Streak mocked at 10 (avoids the 0%-bar edge case at 7).

## Process
1. Three Opus builders in parallel, one per showcase, each owns only its own paths.
2. Each deletes v1 components for its showcase and rebuilds from spec.
3. tsc + scoped eslint per agent; I run the full build + smoke-test routes after.
