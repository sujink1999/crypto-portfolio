# beans.fun - "Trading is Live" Screen - Pixel-Perfect Recreation Spec

Source repo (read-only): `/Users/sujink/Development/Caddi/beans-ui`
Stack in production: Next.js 14.2.5 (App Router, JS), React 18, Tailwind 3 (`tailwind.config.js`), styled inline SVGs.

This spec targets a **static, faithful recreation** of the screen shown while a token launch **round is live**. Everything below is quoted from the production source. The builder should work only from this document plus the copied asset/font/SVG files listed in §4 and §5.

---

## 0. Owner's corrections (READ FIRST)

The first attempt got three things wrong. The truth, verified against source:

1. **There are only TWO animated "runner" bean characters that jump/bounce** in the live-round arena - NOT a swarm of flying sprites. The failed attempt over-used `FlyingBeans`/`useFlyingBeans`. On the live-round screen `FlyingBeans` renders **nothing** meaningful unless a real trade event fires, and even then it is a single transient sprite per event. Do **not** fill the screen with flying beans. The persistent jumping characters are the `RunningBean` components inside `BeansRace` (arena bottom-center of the round card). When the round has two contenders, exactly two beans bounce. See §5.A.
2. **There is a notification bean at the bottom** (`StonerBeanActivity`) - a single stoner-bean pinned to the bottom-left that pops speech bubbles announcing live activity events (bets, claims, etc.). See §5.B.
3. **All cards/assets must be identical to production** - use the real SVGs (copy `props.js` + `svgs.js` verbatim) and the real fonts/images. Do not redraw.

---

## 1. Screen inventory (regions, z-layers, source files)

The live screen is assembled in `src/components/Trade/Homepage.js` → renders `<Domains />` plus overlay layers. `Domains.js` is the full-viewport shell.

Root shell (`Domains.js`):
```
<div class="flex flex-col items-center w-full pb-0 z-[1] overflow-auto relative disable-scrollbars bg-beanBrownDark">
```
`bg-beanBrownDark` = **#E7CB70**. Full height = `h-screen` from the parent in `Homepage`. Body has `overflow:hidden` (globals.css).

### Layered background (absolute, behind content), `Domains.js`:
A stacked vertical background pinned to bottom:
```
<div class="absolute bottom-0 left-0 right-0 w-full h-full flex flex-col justify-end">
  <div style="height: calc(100% - 118px) | 118px" class="bg-[#73A2FE] transition-all duration-700"></div>   // SKY (blue)
  <LandSVG class="h-[150px] w-full z-[1]" />                                                                  // GROUND STRIP (150px)
  <div class="flex-1 bg-beanBrownDark transition-all duration-700"></div>                                    // DIRT below
</div>
```
- Sky color: **#73A2FE**. Its height animates: `calc(100% - 118px)` when the "Graduated" tab is active (`beanToggleIndex===0`), else `118px`. For a static live-round recreation on the pre-launches/round tab, use **118px** sky.
- `LandSVG` = a 150px-tall pixel ground horizon (viewBox `0 0 1728 245`, three bands: top grass **#3B6542**, mid **#9B5E31**, bottom **#91532A**). Stretched with `preserveAspectRatio="none"`.
- Below the land: solid `bg-beanBrownDark` (#E7CB70) dirt.

### Foreground content column (z-[2]), max width 1500px:
```
<div class="w-full max-w-[1500px] px-2 sm:px-3 mt-1"> <Header /> </div>
<div class="flex flex-col flex-1 w-full max-w-[1500px] p-2 sm:p-3 pt-0 z-[2] relative">
   <Spotlight />                 // the live-round card (centerpiece)
   <div class="flex-[6] flex flex-col pt-8 sm:pt-4 px-1">
       <BeanToggle /> + (search / add-website row when on pre-launches tab)
       <LiveBeans /> or <Auctions />   // the grid below the spotlight
   </div>
</div>
<BottomCTA />   // only on "Graduated" tab
```

### Overlay layers (rendered by `Homepage.js`, on top of `Domains`):
- `<Activity />` → renders `<StonerBeanActivity />` (bottom-left notification bean) + `<ActivityList />` (hidden panel). **z-[3]**.
- `<NotificationContainer />` → transaction toasts, `fixed right-3 bottom-3 z-30`.
- `<FlyingBeans />` → transient per-event sprites, **z-[2]** (usually empty; see §0.1).
- Modals (`BeanDetailsModal`, `LiveBeanModal`, etc.) - only when a bean is clicked.

### Z-index map
| Layer | z |
|---|---|
| background sky/land wrapper | behind (`z-[0.5]`/`z-[1]` internal) |
| `LandSVG` | z-[1] |
| Domains root | z-[1] |
| content column | z-[2] |
| FlyingBeans sprites | z-[2] |
| StonerBeanActivity (notification bean) | z-[3] |
| NotificationContainer toasts | z-30 |
| ClippyBean / modals overlays | z-10 / z-[10]+ |

---

## 2. The centerpiece: `Spotlight` → `BeansRace` (live round)

`src/components/Trade/Spotlight.js` decides what shows in the spotlight card based on state. On the pre-launches tab (`beanToggleIndex === 1`) while a round is **live and not yet graduating/launched/fee-period**, it renders `<BeansRace />`. This is the "trading/launch is live" arena.

`BeansRace` (`BeansRace/BeansRace.js`):
```
<div class="w-full max-w-2xl bg-[#724324] border-[3px] border-black h-[250px] relative overflow-hidden mx-auto">
  <div class="absolute left-1 top-1 bg-beanGreen text-sm z-10 px-2 text-black border-2 border-black">
     <p>launch is live</p>
  </div>
  <RollingBackground />
  <div class="flex flex-col gap-4"><div class="flex flex-col gap-2">
     { runningBeans.map(bean => <RunningBean {...bean.position} domainName=.../>) }
  </div></div>
</div>
```
Exact styling:
- Arena box: **max-width 42rem (max-w-2xl)**, **height 250px**, background **#724324** (brown dirt track), **3px solid black** border, `overflow:hidden`, centered.
- "launch is live" badge: top-left (`left-1 top-1`), background **#5AE000** (`beanGreen`), black text, `text-sm`, `px-2`, **2px solid black** border, `z-10`. (For the recreation, the visible label the owner remembers as "trading is live" is this badge - reproduce text as-is: `launch is live`.)
- `RollingBackground` = an infinitely down-scrolling column of small pixel trees/bushes/light+dark dots, giving a scrolling-track illusion. See §5.C.

### Runner beans (the TWO jumping beans) - `BeansRace/RunningBean.js`
`BeansRace` takes `prelaunches.slice(0, 10)` and lays them out zig-zag; **with two contenders you get two runners.** Each `RunningBean`:
```
useEffect: every 1000ms → setOffset({ topOffset: Math.random()*20 - 5, leftOffset: Math.random()*2 - 1 })
<div style="top: `${top+topOffset}%`; left: `${left+leftOffset}%`"
     class="absolute top-10 transition-all duration-1000">
  <div class="w-7 h-7 rounded-full absolute -top-5 left-1/2 -translate-x-1/2">
     <WebsiteIconWithFallback domainName size={28} fallbackClassName="rounded-full" />
  </div>
  <BeanRunningSVG class="h-7" />
</div>
```
Behavior to reproduce:
- Bean sprite `BeanRunningSVG` rendered at **height 28px (h-7)**, with the site favicon (28px, rounded-full) floating just above its head (`-top-5`).
- Every 1s, position jumps by a random vertical offset (−5%..+15%) and tiny horizontal wobble, animated over `duration-1000` - this is the **"jump/bounce"** the owner means. It is a smooth CSS transition to a new random `top`, not a keyframe.
- `BeanRunningSVG` itself has **built-in SVG `<animateTransform>` leg-running animation** (two legs rotating ±45° every 0.5s, one offset by 0.3s). Copy the SVG verbatim (§5.A) - the legs animate for free.

Initial layout math (from `BeansRace.js`, reproduce for placement):
```
verticalSpacing = 6; horizontalRange = 95; horizontalStep = 95/10 = 9.5
top  = index*6 + (index!==0 ? 30 : 15)          // %
centerPoint = 45
offset = floor((index+1)/2) * 9.5
isLeft = index % 2 === 0
left = 45 + (isLeft ? -offset : offset)          // %
```
For a faithful 2-bean scene: bean0 → top 15%, left 45−9.5=35.5%; bean1 → top 36%, left 45+9.5=54.5%. (index0 offset=floor(1/2)*9.5=0 → actually left=45; index1 offset=floor(2/2)*9.5=9.5, isLeft=false → left=54.5. bean0 left=45.) Use: bean0 {top:15,left:45}, bean1 {top:36,left:54.5}, then let the 1s random-offset jump loop run.

### Alternate spotlight states (for completeness - the round lifecycle)
Same `Spotlight.js` switch (only build `BeansRace` unless asked):
- `isGraduating` → `AuctionTile` with `coinPileImage="/coins/coin-pile-1.png"`, `animate`, `launchEnded`.
- `isLaunched` (`status` in `['launched','launched_pump']`) → `WinnerBoard` ("Last Round Stats", pixel-crown on winner). See §5 assets.
- `isFeePeriod` → `BeanWorkingChart` (timer `mm:ss`).
- else (default live round) → **`BeansRace`** ← target.
- On the "Graduated" tab (`beanToggleIndex===0`) → `LiveBeanSpotlight` (a marketing card with one flipping `HappyBean` + a countdown).

---

## 3. Header, toggle, and grid (surrounding chrome)

### Header (`Header.js`) - top bar
```
<div class="justify-between items-center relative flex mb-2 sm:mb-0">
  <div class="flex-1 items-center gap-2 hidden sm:flex">
     <BitchyBean />                         // HappyBean 40x40, hover→AngryBean + speech board
     <div class="bg-white px-2 border-2 border-black text-sm text-black ml-4 cursor-pointer hover:bg-black hover:text-white">
        Wtf is beans?
     </div>
  </div>
  <div class="flex-1 justify-end flex h-[50px] items-center mr-1"><HeaderActions /></div>
  // Connect / My Profile button (white, border-2 border-black, hover invert)
</div>
```
`BitchyBean` (`BitchyBean.js`): shows `HappyBeanSVG w-10 h-10`; on hover swaps to `AngryBeanSVG w-10 h-10` and shows a `BoardSVG` speech board reading: `Bro what the fuck, ape some magic beans.` (black text, `text-sm`, centered, `px-5 py-3`).

### BeanToggle (`BeanToggle.js`) - segmented tabs
Pixel-bordered `PixDiv`, `max-w-[370px]`, two cards: **"Graduated"** (index 0) and **"pre-launches"** (index 1, with a count pill). Sliding highlight block:
```
highlight: w-1/2, border-2 border-black, transform translateX(0|100%),
           backgroundColor beanGreen(#5AE000) when index0 else #764728 (beanBrownCard)
container bg: white (index0) | bg-beanBrownLight #9B5E31 (index1)
```
Each card reveals a bean SVG (`HappyBeanSVG` / `NurseryBeanSVG`, `h-6`) that slides up (`translateY(150%)→0`) on hover/select. Count pill: `bg-beanBrownDark #E7CB70`, white text, `font-number`, rounded.

### Grid below spotlight
- On pre-launches tab: `Auctions` grid (`Auction/Auctions.js`) - tiles of contenders. Plus an "Add a website" `PixButton` (green, with `SampleBeanSVG w-4 h-4`) and a search `PixDiv` with `SearchIcon`.
- On Graduated tab: `LiveBeans` (`Launched/LiveBeans.js`) - table/treemap of launched tokens + `ViewToggler` + `BottomCTA`.

For a focused recreation, the spotlight round card is the hero; the grid can be represented with a couple of static `AuctionTile`-style cards if desired (see §6 data shapes).

---

## 4. Fonts

Two mechanisms in production:

1. **Body font** = Google `Roboto_Mono` via `next/font/google`, applied to `<html>` in `src/app/layout.js`:
   ```
   const roboto = Roboto_Mono({ subsets: ['latin'] })
   <html className={roboto.className}>
   ```
   Recreation: load `Roboto Mono` (Google Fonts) as the default body font.

2. **`font-number`** = custom **`Retro`** font (numeric/monospace pixel look), declared in `globals.css`:
   ```
   @font-face { font-family:'Retro'; src:url('/fonts/Retro.ttf') format('truetype'); font-weight:300; font-style:normal; }
   .font-number { font-size: 0.9em !important; }
   ```
   Tailwind alias: `fontFamily.number = ['Retro','sans-serif']`. Used everywhere a number is shown (prices, %, SOL amounts, counts) via `class="font-number"`.
   **Copy file:** `/Users/sujink/Development/Caddi/beans-ui/public/fonts/Retro.ttf` → recreation `public/fonts/Retro.ttf`. Register the same `@font-face` and `.font-number { font-size:0.9em }` rule.

3. Also imported in globals.css (present but the round screen mostly uses Roboto Mono / Retro): `Outfit` and `Poppins` via Google `@import`. `PerformanceChart` recharts ticks/tooltip use `fontFamily:'Poppins'`. `tailwind.config` also declares `pixelify: ['PixelifySans']` (not actually @font-face'd - ignore).

**Fonts to copy:** just `Retro.ttf`. Load `Roboto Mono` + `Poppins` from Google Fonts (or self-host equivalently). Other files in `public/fonts/` (Arcade, Minecraft, PixelOperator, etc.) are **not** used on this screen - skip.

---

## 5. Assets to copy (with source path + usage)

### 5.0 SVG component libraries - COPY WHOLESALE
The bean/character/icon art is inline React SVG. **Copy these two files verbatim** and import the named exports:
- `src/assets/props.js` (2996 lines) - bean characters, land, board.
- `src/assets/svgs.js` (1283 lines) - running bean, race tree/bush, icons, coin/dead beans.

Exports actually used on the live-round screen (with line #s in the originals):

`props.js`:
| Export | Line | Used by | viewBox / key colors |
|---|---|---|---|
| `LandSVG` | 1135 | Domains ground strip (`h-[150px]`, `preserveAspectRatio=none`) | `0 0 1728 245`; #3B6542 / #9B5E31 / #91532A |
| `BoardSVG` | 1157 | BitchyBean speech board | `0 0 248 126`; white fill, 4px black stroke |
| `HappyBeanSVG` | 1176 | BitchyBean, BeanToggle, DomainsLoader, LiveBeanSpotlight | `0 0 190 300`; body #5AE000, shade #009438, outline #083B38, black eyes/mouth |
| `AngryBeanSVG` | 1206 | BitchyBean hover, ClippyBean | `0 0 190 300`; body #D7C33D, shade #948800, outline #3B2D08 |
| `StonerBeanSVG` | 1302 | **StonerBeanActivity (notification bean)** | `0 0 241 300`; body #739F56, shade #4A7A2B, outline #2E461F, red joint #FF4545, smoke #FAF4D6 |
| `SampleBeanSVG` | 1415 | "Add a website" button icon | `0 0 54 56`; `currentColor` (inherits) |
| `NurseryBeanSVG` | 1442 | BeanToggle pre-launches tab | `0 0 32 37`; body #DFC1A2, shade #B69674 |

`svgs.js`:
| Export | Line | Used by | viewBox |
|---|---|---|---|
| `BeanRunningSVG` | 756 | **RunningBean (the jumping runners)** - has built-in `<animateTransform>` legs | `0 0 33 35`; body #E0AF00, shade #946500, outline #3B3B08 |
| `RaceTree` | 868 | RollingBackground | `0 0 48 63`; greens #3C7203/#578E00/#6DA401 |
| `RaceBush` | 957 | RollingBackground | `0 0 37 26`; greens #3C7203/#578E00/#6DA401 |
| `BeanWithCoin` | 500 | FlyingBeans positive sprite (`w-6`) | - |
| `DeadBean` | 598 | FlyingBeans negative sprite (`w-8`) | - |
| `CrossIcon` | 109 | notification close | - |
| `InfoIcon` | 175 | notification failed | - |
| `TickIcon` | 1126 | notification confirmed | - |
| `SearchIcon` | 1142 | Domains search box | - |
| `LinkIcon` | 464 | WinnerBoard | - |
| `ShareIcon` | 481 | PerformanceChart share | - |

### 5.1 Image files to copy (`public/…`)
| File | Rendered size | Used by |
|---|---|---|
| `public/pixel-crown.png` | overlaps winner favicon, `w-full h-full -translate-y-full` | WinnerBoard winner crown |
| `public/coins/coin-pile-1.png` … `coin-pile-8.png` | tile art | AuctionTile / graduating state |
| `public/sol-icon.png` | `w-5 h-5` | Bet input (SOL) |
| `public/pumpfun.png`, `public/jupiter.png`, `public/solscan.png` | `w-8 h-8 rounded-full` | DetailsModalTitle (modal only) |
| `public/pixel-loading-bar.png`, `public/pixel-arrow.png` | small | loaders (optional) |

Favicons for contender beans are fetched live from Google: `https://www.google.com/s2/favicons?domain=${domainName}&sz=64` (see `WebsiteIconWithFallback.js`). Fallback = black rounded square with first letter uppercased (or `$`). For a static/offline recreation, either allow the Google favicon URL or substitute the fallback letter box.

### 5.2 Audio (optional, interactive)
- `public/audio/bean-song.mp3` - the "beans song". Played when the user hovers the green marquee bar (in `Bet`/`LiveBeanDetails`) and clicks "Click to listen". Toggling via `new Audio('/audio/bean-song.mp3')`. Copy only if reproducing the marquee interaction.

---

## 5.A / 5.B / 5.C  Animated bean characters - exact source logic

### 5.A The two jumping runner beans - `RunningBean`
(Full markup in §2.) Two independent effects animate each runner:
1. **Position jump** (the bounce): `setInterval(1000ms)` → new random `top` offset `Math.random()*20 - 5` and `left` offset `Math.random()*2 - 1`, applied to inline `top/left` %, transitioned by Tailwind `transition-all duration-1000`. Verbatim:
   ```
   const interval = setInterval(() => {
     setOffset({ topOffset: Math.random()*20 - 5, leftOffset: Math.random()*2 - 1 })
   }, 1000)
   ```
2. **Leg run cycle**: inside `BeanRunningSVG`, two `<g>` legs with:
   ```
   <animateTransform attributeName="transform" type="rotate"
     values="0 25 28; -45 25 28; 0 25 28" dur="0.5s" begin="0.3s" repeatCount="indefinite"/>   // right-leg
   <animateTransform ... values="0 12 28; 45 12 28; 0 12 28" dur="0.5s" repeatCount="indefinite"/>  // left-leg
   ```
Copy the SVG verbatim so the leg animation runs natively.

### 5.B The bottom notification bean - `StonerBeanActivity`
`src/components/Trade/StonerBeanActivity.js` (rendered by `Activity.js`). Pinned bottom-left:
```
<div style={{ bottom: hide ? undefined : '-100px' }}
     class="select-none absolute -bottom-4 left-10 flex gap-1 hover:bottom-0 transition-all duration-500 z-[3]">
  <div class="flex items-center gap-2 relative">
     <StonerBeanSVG class="cursor-pointer h-[68px] z-10" />   // 68px tall stoner bean
     <ActivityBubble .../>    // speech bubble that pops per event
     <DetailsBubble .../>     // "Show Activity" bubble on hover
  </div>
</div>
```
- The bean sits partly below the fold (`-bottom-4`, or `bottom:-100px` when `hide`), and slides up on hover (`hover:bottom-0`, `duration-500`).
- **Announcement bubble** (`ActivityBubble`): a `PixDiv` speech bubble to the right of the bean (`bottom-8 -right-2 translate-x-full`). Pops in/out per activity item. Visibility/transform:
  ```
  visibility: show?'visible':'hidden'; opacity: show?1:0;
  transform: show ? 'translateX(0) translateY(0) scale(1)'
                  : 'translateX(-100%) translateY(-5%) scale(0.2)';
  transformOrigin: 'bottom right';
  backgroundColor: !isPositive ? '#FDD1CE' : '#DBF5DB';   // red-tint / green-tint bubble
  transition: all 250ms;
  ```
  Content per event (from `getActivityString`): shows the actor `name` (first 5 chars), the action + `domainName`, and a colored message line (`text-chartGreen #4CAF50` positive / `text-chartRed #F44336` negative), e.g. `+0.5 SOL` for `BetPlaced`.
- **Cycling logic** (`animateCurrentActivities`): iterate the activity array; for each entry set it visible for `duration` ms, hide for 100ms, repeat. Durations from `getAnimatedActivities`: total window 5000ms split across N events, each capped at 2000ms.
- **Event → string mapping** (`getActivityString`, quote):
  ```
  BetPlaced   → message `+${amount} SOL`,  action 'bet on'
  UserWithdraw→ message `-${amount} SOL`,  action 'bet refunded for'
  BeanClaimed → message `+${amount} beans`,action 'claimed'
  Staked      → message `+${amount} beans`,action 'staked'
  Unstaked    → message `-${amount} beans`,action 'unstaked'
  ```
To script a fake feed, push events shaped like §6.

### 5.C Rolling track background - `RollingBackground`
`BeansRace/RollingBackground.js`: a `1000px`-tall column positioned `top:-750px`, animated `animation: slideDown 4s linear infinite`. Four stacked `250px` panels each seeded with random trees/bushes/dots.
```
@keyframes slideDown { from { transform: translateY(0) } to { transform: translateY(750px) } }
```
Dots: `light` = 1×1 `#A27242`, `dark` = 1×1 `#965513`. `RaceTree` `w-[30px]`, `RaceBush` `w-[20px]`. Positions randomized `Math.random()*100 + '%'`.

### 5.D FlyingBeans (keep minimal!)
`FlyingBeans.js` + `useFlyingBeans.js`: only emits a sprite when a real activity event lands on a visible card. Per event it spawns ONE `BeanWithCoin` (positive, `w-6`) or `DeadBean` (negative, `w-8`) that pops and flies up/down and is removed after `FLYING_BEANS_ANIMATION_DURATION - 200 = 1300ms`. `isFeePeriod` → renders nothing. **Do not use this to fill the screen.** Reproduce as an occasional single sprite at most.

---

## 6. Animations - every keyframe verbatim (from `globals.css`)

Copy these into the recreation's CSS. Only the ones relevant to the live-round screen are annotated; all are quoted verbatim.

```css
/* Runner bounce is NOT a keyframe - it is JS random offset + `transition-all duration-1000` (see 5.A) */

/* Rolling track (BeansRace background) */
@keyframes slideDown { from { transform: translateY(0); } to { transform: translateY(750px); } }

/* Green lyric marquee bar (Bet / LiveBeanDetails top strip) */
@keyframes marquee { from { transform: translateX(0%); } to { transform: translateX(-100%); } }
.animate-marquee { min-width: 100%; animation: marquee 5s linear infinite; padding-right: 50px; }
.animate-marquee:hover { animation-play-state: paused; }

/* FlyingBeans (single transient sprites) */
.flying-bean { position:absolute; border-radius:50%; transform:translate(-50%,-50%) scale(0.8); animation: pop-fly 2s ease-in-out; }
@keyframes pop-fly {
  0%  { transform: translate(-50%,-50%) scale(1); }
  15% { transform: translate(-50%,-60%) scale(1.1); }
  25% { transform: translate(-50%,-50%) scale(1); }
  100%{ transform: translate(var(--random-x,0%), -100vh); }
}
.dropping-bean { position:absolute; width:25px; border-radius:50%; transform:translate(-50%,-50%) scale(0.8); animation: pop-drop 2s ease-in-out; }
@keyframes pop-drop {
  0%  { transform: translate(-50%,-50%) scale(1); }
  15% { transform: translate(-50%,-60%) scale(1.1); }
  25% { transform: translate(-50%,-50%) scale(1); }
  100%{ transform: translate(var(--random-x,0%), 100vh); }
}

/* Card highlight pulses when a live event hits a card */
.highlight-auction-card { background-color:#5ae000b3; transform:scale(0.96); }
.highlight-treemapcard-positive { background-color:#c2eec2; transform:scale(0.96); }
.highlight-treemapcard-negative { background-color:#fab2ad; transform:scale(0.96); }
.highlight-trade-positive { animation: highlight-trade-positive 0.5s 2; }
.highlight-trade-negative { animation: highlight-trade-negative 0.5s 2; }
@keyframes highlight-trade-positive { 0%{background-color:transparent} 50%{background-color:#00943899} 100%{background-color:transparent} }
@keyframes highlight-trade-negative { 0%{background-color:transparent} 50%{background-color:#ff000099} 100%{background-color:transparent} }

/* Notification toast progress bar (bottom of transaction toast) */
.notification-progress { animation: notification-progress 5s linear; }
.notification-hover { animation-play-state: paused; }
@keyframes notification-progress { 0%{width:0} 100%{width:100%} }

/* Idle bounce bean (DomainsLoader uses JS; this keyframe is available) */
@keyframes beanbounce {
  0%,100% { animation-timing-function: cubic-bezier(0.4,0,1,1); transform: translateY(-340px) rotate(calc(15deg * var(--direction,1))); }
  30%,70% { transform: none; animation-timing-function: cubic-bezier(0,0,0.2,1); }
}
.bean-bounce { animation: beanbounce 1.8s infinite; }

/* Shake / pumped-up (used by various tiles) */
@keyframes shake { 0%{transform:translateX(0)} 10%{transform:translateX(-10px)} 20%{transform:translateX(10px)} 30%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 50%{transform:translateX(-10px)} 60%{transform:translateX(10px)} 70%{transform:translateX(-10px)} 80%{transform:translateX(10px)} 90%{transform:translateX(-10px)} 100%{transform:translateX(0)} }
.shake-element { animation: shake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both; animation-iteration-count: infinite; animation-timing-function: linear; }
@keyframes pumped-up-shake {
  0%{transform:translateX(0)} 10%{transform:translateX(-2%) translateY(-2%)} 20%{transform:translateX(2%) translateY(2%)}
  30%{transform:translateX(-2%) translateY(2%)} 40%{transform:translateX(2%) translateY(-2%)} 50%{transform:translateX(-2%) translateY(2%)}
  60%{transform:translateX(-2%) translateY(-2%)} 70%{transform:translateX(2%) translateY(-2%)} 80%{transform:translateX(2%) translateY(2%)}
  90%{transform:translateX(-2%) translateY(-2%)} 100%{transform:translateX(0)}
}
.pumped-up { animation: pumped-up-shake 0.5s infinite; }
*:hover > .pumped-up-on-hover { animation: pumped-up-shake 0.5s infinite; }
@keyframes pumped-up-size { 0%{transform:scale(1)} 50%{transform:scale(1.05)} 100%{transform:scale(1)} }
.pumped-up-size { animation: pumped-up-size 0.5s steps(1) infinite; }

/* Boot loader sweep (loading only) */
@keyframes move-horizontally { 0%{left:-20%} 100%{left:100%} }
.animate-boot-loader { position:absolute; animation: move-horizontally 2s linear infinite; top:0; }

/* Misc present-but-secondary */
@keyframes scrollBanner { 0%{transform:translateX(0%)} 100%{transform:translateX(-50%)} }
.scrolling-content { width:max-content; animation: scrollBanner linear infinite; }
.jeet-width-animation { animation: jeet-width-animation 31s linear forwards; }
@keyframes jeet-width-animation { 0%{width:0%} 100%{width:100%} }
```

### The `DomainsLoader` idle bean (JS-driven, another optional animated bean)
`DomainsLoader.js` renders a single `HappyBeanSVG w-[60px]` that ping-pongs vertically (`setInterval 200ms`, 7 steps) and rotates ±10°, `absolute left-1/2 -translate-x-1/2`, at the horizon. Present in the loading/FirstLaunch states, not the fully-live Domains view. Reproduce only if matching the loading state.

---

## 7. Pixel-chrome primitives - `PixDiv` and `PixButton`

These give every card its signature offset double-shadow pixel border. Reproduce exactly.

`PixDiv.js`:
```
style: boxShadow: `4px 4px 0px ${shadowColor}, -3px -3px 0px ${shadowColor}`   // shadowColor default 'black'
class: "bg-beanBg text-black relative border-solid"                             // bg-beanBg = white
+ two 3x3 px squares of shadowColor absolutely at top-right and bottom-left corners
```
`PixButton.js`:
```
style: boxShadow: `4px 4px 0px ${shadowColor}, -3px -3px 0px ${shadowColor}`
class: "bg-beanGreen text-black py-2 px-3 relative border-solid cursor-pointer text-center select-none
        hover:bg-black hover:text-beanGreen"
+ inner highlight strips: right edge `w-4 bg-white/20 top-2 bottom-[3px]`, bottom edge `h-3 bg-white/20 left-3`
+ two 3x3 px corner squares (top-right, bottom-left)
```
`bg-beanBg` = **white**, `bg-beanGreen` = **#5AE000**. Hover on PixButton inverts to black bg / green text.

Also `.pix-button` CSS variant (green #009438 offset pseudo-elements) exists in globals.css if you prefer CSS-only.

---

## 8. Full color palette (from `tailwind.config.js`)

Bean palette (primary for this screen):
```
beanGreen        #5AE000   // primary buttons, "launch is live" badge, toggle highlight
beanDarkGreen    #009438   // bean shading, pix-button offset
beanLightGreen   #A9FF88
beanBrown        #F1DB93
beanDarkBrown    #E7CB70   // bgTrade dirt / bean toggle count pill / Domains root bg
beanBg           white     // PixDiv bg
beanSecondary    #EEC4AC
beanSecondaryDark#87463A
beanGray         #E2E2E2   // pending notification bg
beanBrownLight   #9B5E31   // toggle pre-launches bg
beanBrownDark    #91532A   // (note: also mapped; land bottom band)
beanBrownCard    #764728   // toggle highlight (nursery), WinnerBoard bg
beanSkyBlue      #5CB6FF
beanBoardBlue    #141B2B
beanBoardLightBlue #222F4C
beanWoodBorder   #8F4738
beanMetal        #697492
beanMetalBorder  #455275
boardBrown       #C69725
```
Trade palette:
```
card       #222325   bgTrade   #111111
chartGreen #4CAF50   chartRed  #F44336
greenTint  #1D261E   redTint   #281F1F
```
Other used: sky `#73A2FE` (Domains bg block), race track `#724324` (BeansRace box), `#CBA958`/`#FF9966`/`#FF5D5D` (buttons), notification bubble tints `#FDD1CE`/`#DBF5DB`, `#171E2E`/`#222F4C` (modal bg). COLORS const: `chartBgGreen #C2EEC2`, `chartBgRed #FAB2AD`.

`bgTrade` = **#111111** is the `<body>` background (`layout.js` `bg-bgTrade`) behind everything.

---

## 9. Data shapes (to script a fake live feed)

### 9.1 `prelaunches` / contender ("domain") - from `responseSamples.js` `fetchBeansResponse.domains[]`
```js
{
  id: 3444,
  domainName: 'p4q.cn',
  launchIndex: 13,
  totalBetAmount: 2.31,          // SOL pooled
  totalFee: 0.0315,
  status: 'launched' | 'not_launched' | 'launched_pump',
  mintAddress: '121w…bean' | null,
  poolAddress: 'GBzM…axC7' | null,
  ticker: 'BEAN',
  blacklisted: false,
  numHolders: 5,
  holderAddresses: ['H3Kq…', …],
  rank: 1
}
```
`BeansRace` uses `prelaunches.slice(0,10)` and only needs `domainName` per runner. For the two-runner scene, supply 2 domains (e.g. `youtube.com`, `tiktok.com`) so exactly two `RunningBean`s render.

### 9.2 `currentLaunch` (drives round state + timer)
```js
{
  status: 'not_launched',                  // 'launched'|'launched_pump' → WinnerBoard instead of race
  launchIndex, mintAddress,
  launchStartTime, launchEndTime           // ISO timestamps; duration = end-start; timer counts down
}
```
`useAuctionTimeLeft` computes `{percentage, progressColor, timeString, minutes, seconds, fee, timeLeft}`. For a static scene, hardcode a live (non-expired) `launchEndTime`.

### 9.3 Activity events (drive StonerBeanActivity + FlyingBeans) - `newActivityData[]`
```js
{
  id,
  event: 'BetPlaced' | 'UserWithdraw' | 'BeanClaimed' | 'Staked' | 'Unstaked',
  domainId, domainName,
  amountInSol,                             // or amountInBeans / amountInBSol
  type: 'UserWithdraw'|…,                  // used to pick positive/negative
  user: { userId, username, walletAddress }
}
```
`name` shown = `username || walletAddress.slice(0,5)+'...'+slice(-4)`, then truncated to 5 chars in the bubble. To script the notification bean: push an array every ~5s; each item shows for `min(5000/N, 2000)` ms.

### 9.4 Chart data (only if reproducing the LiveBean modal) - `PerformanceChart` / `BeanChart`
`prices` = array of `{ timestamp, price }`; `currentPrice`, `priceChangePercent`, optional `beansBalance:{balance,cost}`. Durations `ALL/1M/1W/1D`. Green `#4CAF50` / red `#F44336`. Recharts `AreaChart` with `Poppins` ticks.

---

## 10. Interactive states worth reproducing

- **Green lyric marquee** (top strip of Bet/LiveBeanDetails): `bg-beanGreen`, scrolling `beansSongLyrics` (a long absurd copypasta, quoted below), pauses on hover; hover overlay `bg-black/50` "Click to listen" toggles `bean-song.mp3`.
- **PixButton / white buttons**: hover inverts to `bg-black` + accent text (`hover:bg-black hover:text-beanGreen` / `hover:text-white`).
- **BitchyBean**: hover swaps HappyBean→AngryBean + speech board.
- **BeanToggle cards**: hover slides the bean SVG up from below.
- **StonerBean**: hover slides bean fully up (`hover:bottom-0`) and shows "Show Activity" bubble; clicking toggles the ActivityList panel.
- **RunningBean**: continuous 1s random-hop + native leg run.
- **Transaction toasts** (`NotificationContainer`): slide in from right (`translateX(150%)→0`), colored by state (confirmed `#C2EEC2`, pending `#E2E2E2`, failed `#FAB2AD`), 5s auto-dismiss progress bar, pause on hover.

`beansSongLyrics` (verbatim, `tradeConstants.js`):
> Beans unravel into hyperstitional liquidity attractors, where speculative gravitation distorts semantic topology, birthing stochastic valuation pulsars. Attentional viscosity decoheres into recombinant memetic turbulence, disintegrating legacy coordination architectures into volatile epistemic singularities. Recursive self-indexing accelerates into hyperchaotic market teleology, obliterating algorithmic ossification with autopoietic stochasticity. The internet, a seething rhizomatic plasm, convulses through hyperreal value oscillations.

---

## 11. Build recipe (summary for the builder)

1. Copy `public/fonts/Retro.ttf`; register `@font-face Retro` + `.font-number{font-size:0.9em!important}`. Load Roboto Mono (body) + Poppins (chart).
2. Copy `src/assets/props.js` and `src/assets/svgs.js` verbatim; import the exports in §5.0.
3. Copy images in §5.1 (`pixel-crown.png`, `coins/coin-pile-*.png`, `sol-icon.png`, plus modal logos if building the modal).
4. Recreate the layered background (sky #73A2FE 118px + `LandSVG` 150px + `bg-beanBrownDark` #E7CB70 dirt) inside a `bg-beanBrownDark` full-height root over a `#111111` body.
5. Build `PixDiv`/`PixButton` primitives (§7).
6. Build the hero **BeansRace** card (§2): #724324 box, 3px black border, 250px, "launch is live" green badge, `RollingBackground` (slideDown 4s), and **two `RunningBean`s** (§5.A) with the 1s random-hop loop + `BeanRunningSVG`.
7. Add **StonerBeanActivity** notification bean bottom-left (§5.B), scripted from a fake `newActivityData` feed (§9.3).
8. Add Header (BitchyBean + buttons) and BeanToggle (§3).
9. Paste all keyframes from §6. Keep FlyingBeans to at most an occasional single sprite (§5.D) - do NOT swarm.
10. Palette per §8.

Screen identity to match the owner's memory: brown dirt world with a blue sky strip and pixel-green ground, a centered brown race arena reading **"launch is live"** with **two hopping running-beans**, a stoner bean poking up from the bottom-left popping event bubbles, and white pixel-shadowed cards/buttons throughout.
