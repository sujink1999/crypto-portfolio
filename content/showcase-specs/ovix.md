# 0VIX dApp - UI Recreation Spec

A faithful recreation spec for the **0VIX lending markets dashboard** and the
**TransactionToast** widget, for use in the portfolio demo. All values are quoted
verbatim from the source repo (`/Users/sujink/Development/Gogo0vix/0vix-frontend`,
branch `auto-transact`). 0VIX is a Compound-style lending protocol on Polygon PoS
and Polygon zkEVM - users supply collateral and borrow assets. Recreate as a
static/mocked demo; no wallet or chain calls needed.

---

## 1. Design tokens (from `tailwind.config.js`)

Copy this palette verbatim into the recreation's Tailwind theme (`extend.colors`):

```js
secondary:       '#C7C9CC',
tertiary:        '#7C8792',
'primary-purple':'#967CC9',
purple:          '#967CC9',
chip:            '#242B33',
dropdown:        '#4D5966',
card:            '#1B2127',
darkCard:        '#161B20',
red:             '#FF0000',
green:           '#22C55E',
'card-expanded': '#313D49',
cardLight:       '#313D49',
border:          '#BDBDBD',
mcard:           'rgba(27,33,38,0.2)',
mcardBorder:     'rgba(36,43,51,0.4)',
mcardLight:      'rgba(27,33,38,0.8)',
mobileHeader:    '#13171B',
naColor:         '#D9D9D9',
```

Other extends: `transitionProperty.height: 'height'`, `height: { px: '1px', 150: '150px' }`,
`maxWidth: { 1400: '1400px' }`, `minWidth: { 550: '550px' }`, `borderWidth: { px: '1px' }`.

Custom flex utilities (defined in `src/App.css`, not Tailwind): `.flex-2 { flex: 2 2 }`,
`.flex-3 { flex: 3 3 }`, `.flex-4 { flex: 4 }`, `.flex-5 { flex: 5 }`, `.flex-pt5 { flex: 0.5 }`.
These are used heavily for the market-row column widths.

### Page background & body

From `src/App.css`:

```css
body {
    background: url('./assets/0vix-bg.png'), #040301;
    background-size: auto;
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-position: top;
    font-family: 'Outfit', sans-serif;
    overflow-x: hidden;
}
```

Base text color is white - from `src/index.css`: `:root, body, html { color: #fff; }`.
The dashboard background image is `src/assets/0vix-bg.png` (a dark gradient/glow at top).
Effective backdrop is near-black `#040301` with the glow image at the top.

Custom scrollbar (App.css): track `rgba(0,0,0,0.1)`, thumb `#ac90e3`, width `5px`, radius `5px`.

---

## 2. Fonts

Two font systems are loaded - recreate both, but the **dashboard uses `Outfit`**:

- **`src/index.css`** imports Google Fonts and sets a global default:
  ```css
  @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM%20Sans&display=swap');
  *, *::after, *::before { font-family: DM Sans, sans-serif; ... }
  ```
- **`src/App.css`** overrides `body` (and toasts/tooltips) to **`'Outfit', sans-serif`** -
  this is the font actually seen on the dashboard and toast. `Outfit` is expected to be
  provided by the host page; for the recreation, load Outfit from Google Fonts:
  `https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap`.
- Toast/tooltip/react-toastify also force `font-family: 'Outfit'`.

**No local font files (.woff/.ttf/.otf) exist in the repo** - all fonts are Google-hosted.
For the portfolio recreation use `Outfit` (weights 300/400/500/600/700 are all used:
`font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold`).

---

## 3. Layout inventory - main dashboard/markets screen

Root screen: `src/Home.tsx`. Overall structure top→bottom:

| Region | Component / file | Notes |
|---|---|---|
| Sticky top nav | `src/Components/Header/Header.tsx` | Logo + nav links left; chain switcher, rewards, wallet, mobile menu right |
| (Conditional) Polygon PoS pause banner | `Header.tsx` (chainId 137 block) | Purple full-width notice bar |
| Count dashboard (stats row) | `src/Components/CountDashboard/CountDashboard.tsx` → `TotalCounts.tsx` + `CountLayout.tsx` | Total Supplied / Total Borrowed / Your Supplied / Your Borrows + balance card |
| Two-column market area | `Home.tsx` | Left column = Supply side, right column = Borrow side |
| ↳ Supplied Assets | `AssetMarketSection` (`isMarket=false, forBorrow=false`) | User's supplied positions |
| ↳ Supply Markets | `AssetMarketSection` (`isMarket, forBorrow=false`) | All suppliable markets |
| ↳ Borrowed Assets | `AssetMarketSection` (`forBorrow`) | User's borrows |
| ↳ Borrow Markets | `AssetMarketSection` (`isMarket, forBorrow`) | All borrowable markets |
| Market list wrapper / column headers | `src/Components/shared/MarketLayout.tsx` (`AssetLayout`) | Sortable column headers |
| Market row card | `src/Components/shared/AssetCard/AssetCard.tsx` | Collapsed row + expandable detail |
| Footer | `src/Components/shared/Footer.tsx` | - |
| Floating transaction toast | `src/Components/TransactionToast/TransactionToast.tsx` | Bottom-right fixed |

### Home container classes (verbatim)

```jsx
<div className="flex flex-col items-center min-h-screen">
  <Header />
  <div className="w-full max-w-7xl flex gap-12 flex-col items-center flex-1 min-h-500 p-3 py-6">
    <CountDashboard />
    <div className="flex flex-col lg:flex-row w-full lg:items-start justify-between gap-4">
      <div className=" flex flex-1 flex-col gap-8"> {/* Supplied Assets + Supply Markets */} </div>
      <div className=" flex flex-1 flex-col gap-8"> {/* Borrowed Assets + Borrow Markets */} </div>
    </div>
  </div>
  <Footer />
</div>
```

Content max width: `max-w-7xl` (1280px). Two equal columns (`flex-1`) with `gap-4`,
stacking to single column below `lg`.

### Header (`Header.tsx`)

- Outer sticky bar: `flex justify-center w-screen py-3 bg-mobileHeader lg:bg-black/10 sticky top-0 z-10 lg:backdrop-blur-lg lg:border-b-px border-border/20`
  - i.e. mobile bg `#13171B`, desktop translucent black with `backdrop-blur-lg` and a
  1px bottom border at `border-border/20` (`#BDBDBD` @ 20%).
- Inner row: `flex items-center w-full justify-between max-w-1400 py-1 px-3`.
- Logo: `<img src={OvixLogo} className="w-20" />` - asset `src/assets/images/ovixlogo.svg` (width 80px).
- Nav links (desktop, `hidden lg:flex gap-8`): "Governance" (external link), a "Products"
  dropdown (`ProductDropDown`). Nav link class: `hover:text-primary-purple transition-all cursor-pointer`.
- Right cluster: `flex gap-1 sm:gap-2 lg:gap-3 items-center` - ChainSwitcher, (Rewards dropdown
  when connected on chain 137), WalletDropDown, mobile menu button.
- Mobile menu button: `bg-[#191F26] rounded-lg p-2`, turns `border-purple bg-purple` when open.
- Pause banner (chain 137): `bg-purple w-screen`, inner `max-w-1400 w-full py-2 px-4`,
  text `text-sm text-center`.

### Count dashboard (`TotalCounts.tsx` / `CountLayout.tsx`)

Desktop (`TotalCountsDesktop`, width ≥ 1280): a full-width block containing two stat rows
separated by thin dividers `h-px bg-border w-full bg-opacity-20`.
- Row 1: `TOTAL SUPPLIED` + `TOTAL BORROWED` (left), a promo `ImageTagCard` (right).
- Row 2: `YOUR SUPPLIED` + `YOUR BORROWS` + `YourBalance` card.

`CountLayoutDesktop` stat block:
- Label: `text-xs text-secondary` (`#C7C9CC`), e.g. `TOTAL SUPPLIED`.
- Value: `text-[32px] leading-8 font-medium`, dollar-prefixed. (Mobile `CountLayout` uses `text-[18px] leading-8`.)
- Values render via `ExtrapolatedNumber` (an animated counter that ticks up by APY/interest -
  for the demo a static formatted number is fine, or a simple count-up).
- Tooltips via `react-tooltip`, `backgroundColor="#0c0f12" textColor="#c7c9cc"`.

### Market section headers (`MarketLayout.tsx` → `AssetLayout`)

- Section title: `<p className="text-[24px] leading-[32px]">{title}</p>` - e.g. "Supply Markets".
- Column header row (desktop only, `hidden lg:flex px-3 py-2`), columns with flex weights:
  - `Asset` - `flex-3`
  - `APY` - `flex-2`
  - `Rewards` - `flex-3` (only shown when `chainId === 137`)
  - `Supplied`/`Borrowed` (your position) - `flex-3`, hidden when `forMarket`
  - `Total Supplied`/`Total Borrow` - `flex-3`
  - trailing spacer - `flex-1`
- Header label color: selected column `text-white`, others `text-tertiary` (`#7C8792`), all `text-sm`.
- Each has a `SortArrowIcon` that rotates 180° when sorted descending.
- Empty section is hidden (`arrayChildren.length === 0 && 'hidden'`).

---

## 4. Market row card (`AssetCard.tsx`) - detailed style breakdown

The centerpiece component. A row that expands on click.

### Card container

```jsx
<div className={` flex transition-all backdrop-blur-md duration-500 flex-col cursor-pointer ${
    !isExpanded ? ' bg-mcard hover:bg-mcardLight ' : 'bg-mcardLight'
}  px-3 rounded-lg border border-chip select-none py-1`} onClick={toggle}>
```

- Background: `bg-mcard` = `rgba(27,33,38,0.2)`; hover / expanded `bg-mcardLight` = `rgba(27,33,38,0.8)`.
- `backdrop-blur-md`, `rounded-lg` (8px), `border border-chip` (1px `#242B33`), `px-3 py-1`.
- Expand/collapse transition: `transition-all duration-500`.

### Collapsed row (desktop), height `h-12` (48px)

Columns mirror the header weights:
- Asset: `<img src={logo} className="h-6 w-6" />` + `<Text>{symbol}</Text>` in `flex-3`.
- APY: `flex-2`, plain `<Text>{apyValue}</Text>` (e.g. `4.21%`).
- Rewards chip: `flex-3` (chain 137 only) - see RewardChip below.
- Your position: `flex-3`, value + `text-xs text-tertiary` USD subline like `($1.2K)`. Hidden in market view.
- Total supplied/borrowed: `flex-3`, value + USD subline.
- Trailing: `flex-1 justify-end` expansion button.

`Text` component (`src/Components/shared/Text.tsx`) is a trivial `<p className={className}>`
wrapper - default body font/size (Outfit, 16px white).

### RewardChip (rewards column)

```jsx
<div className="flex rounded-full items-center bg-chip p-1 gap-1">
  <div className="bg-card p-[3px] rounded-full"><img src={vixIcon} className="h-5 w-5" /></div>
  {/* optional overlapping GNS/LDO token icons with -ml-3 */}
  <Text className="text-sm font-bold pr-1">{apr}%</Text>
</div>
```
- Pill: `rounded-full bg-chip` (`#242B33`), inner token badge `bg-card` (`#1B2127`) `rounded-full`.
- Token icon `h-5 w-5`; overlapping extra tokens use `-ml-3`.
- APR text `text-sm font-bold`.
- Hover shows a `@tippyjs/react` tooltip (`theme="ovix-theme"`) breaking down VIX/GNS/LDO rewards.
- `vixIcon` = `src/assets/images/0VIX-logo.svg`, `GNSLogo` = `GNS-logo.png`, `LDOLogo` = `LDO-logo.png`.

### Expansion button (`ExpansionButton`)

```jsx
<div className="flex rounded-lg bg-dropdown p-2 items-center justify-center gap-1">
  <img src={downArrow} className={`h-2 w-2 ${isExpanded && 'rotate-180'}`} />
</div>
```
- `bg-dropdown` (`#4D5966`), `rounded-lg`, `p-2`; arrow `src/assets/icons/downarrow.svg` `h-2 w-2`, rotates 180° when open.

### Expanded detail panel

Wrapped in a height-animated div: `transition-all duration-500`, expanded `h-24 visible`,
collapsed `collapse h-0`. Contains:
- Divider: `h-px bg-dropdown w-full`.
- Two-column detail (`flex gap-5 py-2 justify-between`, each `flex-1 max-w-250`):
  - Left: `SUPPLY APY`/`BORROW APY` row (with token logo), optional `OVIX APR`, optional `LDO/GNS APR`.
  - Right: `Collateral` (a `Switch` toggle) or `Liquidity` (borrow), `Total/Your Supplied/Borrowed`, `{symbol} Wallet Balance`.
- Detail rows use `AssetCardRow`: `flex justify-between items-center py-1 text-sm`, optional `h-5 w-5` icon, label left / value right.

### Action buttons (shown in the expanded/mobile header cluster)

`Supply`/`Withdraw` (supply side) or `Borrow`/`Repay` (borrow side). Built with the shared
`Button` (`src/Components/shared/Button.tsx`):
- `normal` variant: `bg-purple rounded-md border-solid border-[1px] border-purple hover:bg-purple/70 transition-all`.
- `secondary` variant: `bg-dropdown ... border-dropdown hover:bg-dropdown/70`.
- `disabled`: `bg-dropdown/50 text-tertiary border-dropdown rounded-md border-[1px] cursor-not-allowed`.
- Card CTAs sized `text-xs p-1 px-5`.

### `fade-in` animation (used across cards)

From `src/App.css`:
```css
.fade-in { animation: fadeIn 1.5s; }
@keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
```

### Status gradients (health bar / status pills - App.css, useful accent detail)

```css
.normal-status-gradient  { background: linear-gradient(274.72deg, rgba(120,255,204,0.5) 0%, rgba(120,255,204,0.1) 51.56%, rgba(217,217,217,0.1) 100%); }
.warning-status-gradient { background: linear-gradient(274.72deg, rgba(255,186,106,0.5) 0%, rgba(255,186,106,0.1) 51.56%, rgba(217,217,217,0.1) 100%); }
.bad-status-gradient     { background: linear-gradient(274.72deg, rgba(183,30,39,0.5) 0%,  rgba(183,30,39,0.1) 51.56%,  rgba(217,217,217,0.1) 100%) !important; }
```

---

## 5. TransactionToast + ExpandableBox + Loader

Files: `src/Components/TransactionToast/TransactionToast.tsx`, `ToastLineItem.tsx`,
`styles.css`; `src/Components/shared/ExpandableBox.tsx`;
`src/Components/shared/Loaders/Loaders.tsx` + `Loaders/styles.css`.

### Toast container (verbatim)

```jsx
<div className={` transition-all shadow-md select-none bg-darkCard right-4 bottom-4 fixed rounded-md w-[306px] overflow-hidden ${
    openToast ? 'show-toast' : 'hide-toast'}`}>
```
- Fixed bottom-right (`right-4 bottom-4`), width **306px**, `bg-darkCard` (`#161B20`),
  `rounded-md`, `shadow-md`, `overflow-hidden`.
- Slide in/out (`styles.css`):
  ```css
  .show-toast { transform: translateX(0); }
  .hide-toast { transform: translateX(calc(100% + 40px)); }
  ```

### Progress bar (top strip)

```jsx
<div className="flex bg-[#4D5966]">
  <div className={` h-[5px] ${shouldClose ? ' load-progress' : ' w-full'} `}
       style={{ backgroundColor: progressColor }} />
</div>
```
- 5px tall track `#4D5966`; fill colored by current stage's `progressColor`.
- On terminal stages it animates width 0→100% over 5s (auto-dismiss visual):
  ```css
  .load-progress { animation: extend-width 5s forwards ease-in-out; }
  @keyframes extend-width { 0% { width: 0; } 100% { width: 100%; } }
  ```

### The three stacked `ExpandableBox` sections

The toast body is three vertically-stacked `ExpandableBox` panels that grow/shrink
independently based on the current stage:
1. **Steps panel** (`show` when not `VIEW_TX_HASH`): the two transaction steps.
2. **Tx details panel** (`show={showTxDetails}`): Amount / APY / LTV / % of supply borrowed.
3. **Tx hash panel** (`show={showTxHash}`): "View on Polygonscan" link bar.

### `ExpandableBox` mechanics (verbatim)

```jsx
const growOrShrink = (show) => {
  if (!growDiv.current) return
  if (!show) growDiv.current.style.height = '0'
  else growDiv.current.style.height = wrapper.current?.clientHeight + 'px'
}
useEffect(() => { growOrShrink(show) }, [show, refresh])

return (
  <div className={concatClasses([' transition-all duration-500 ', show ? `visible fade-in` : ' collapse ', className])} ref={growDiv}>
    <div ref={wrapper}>{show && children}</div>
  </div>
)
```
- The outer div's `height` is set imperatively to the inner wrapper's measured
  `clientHeight` (or `0`), and `transition-all duration-500` animates the resize.
- A `refresh` counter (bumped in TransactionToast on every `toastTxStatus`/`openToast`
  change) forces re-measurement so the box re-fits when its content changes.
- Children only render when `show` (`{show && children}`).

### Transaction steps

Two `TransactionStep`s (an optional "Approve" step 1 + a "Creating Transaction" step 2),
connected by a little dotted spine:
```jsx
<div className="flex flex-col gap-1 w-9 items-center">
  <div className="h-[6px] w-[2px] bg-[#B5B5B533] rounded-sm" />
  <div className="h-1   w-[2px] bg-[#B5B5B533] rounded-sm" />
  <div className="h-[6px] w-[2px] bg-[#B5B5B533] rounded-sm" />
</div>
```

`TransactionStep` layout: `flex items-center gap-3`, a `w-9 h-9 rounded-full` icon disc
(`bg-black/20` when IDLE, else `bg-black/40`), then title (`font-semibold`, `text-white`
or `text-white/30` when idle) + subtitle (`text-tertiary text-sm leading-4`).

Icon by `StepType`:
- `IN_PROGRESS` → `<TransactionLoader color={loaderColor} />`
- `IDLE` → `<p className="font-light text-white/30">{stepNumber}</p>`
- `ERROR` → `<ErrorIcon className="w-5 h-5" />`
- `DONE` → `<CircularSuccessIcon className="w-5 h-5" />`

Step copy:
- Step 1 "Approve" → success "Approved!" / error "Approval failed." / subtitle
  "This approve only need to be completed once for each token." - loaderColor `#6A4AF2`.
- Step 2 "Creating Transaction" → success "Created Transaction" / error "Transation failed."
  / subtitle "Please confirm the transaction in your wallet." - loaderColor `#488FFF` when
  `TX_SUBMITTED`, else `#967CC9`.

### The spinner / loader (`Loaders.tsx` + `Loaders/styles.css`, verbatim)

An 8-dot circular chaser built purely from `box-shadow`:
```css
.custom-loader {
    --d: 10px;
    width: 1px;
    height: 1px;
    border-radius: 100%;
    color: #6a4af2;
    box-shadow: calc(1 * var(--d)) calc(0 * var(--d)) 0 0,
        calc(0.707 * var(--d)) calc(0.707 * var(--d)) 0 0.3px,
        calc(0 * var(--d)) calc(1 * var(--d)) 0 0.8px,
        calc(-0.707 * var(--d)) calc(0.707 * var(--d)) 0 1px,
        calc(-1 * var(--d)) calc(0 * var(--d)) 0 1.5px,
        calc(-0.707 * var(--d)) calc(-0.707 * var(--d)) 0 2px,
        calc(0 * var(--d)) calc(-1 * var(--d)) 0 2px;
    animation: s7 1s infinite steps(8);
}
@keyframes s7 { 100% { transform: rotate(1turn); } }
```
`TransactionLoader` just applies `.custom-loader` and overrides `color` inline (the dots
inherit `currentColor`), so the spinner tints to the step's `loaderColor`.

### Tx details panel (`ToastLineItem`)

Divider `h-[1px] bg-dropdown mt-1`, then `flex flex-col gap-1 p-3` of line items:
- `Amount` → `{amount} {symbol}`
- `Supply/Borrow APY` (with token `logo` `h-4 w-4`) → `{apy}%`
- `Loan-To-Value` → `{ltv}%`
- `% of Supply Borrowed` → `{pct}%`

`ToastLineItem`: `flex justify-between`; left `flex items-center gap-2` with optional
`<img className="h-4 w-4" />` + `text-tertiary` label; right `text-white font-medium` value.

### Tx hash bar

```jsx
<div className="pr-3 h-10 flex bg-chip items-center pl-3 text-sm font-light justify-between">
  <div className="text-[#F2F4FE] underline transition-all flex items-baseline gap-2 hover:text-purple cursor-pointer">
    <p>View on Polygonscan</p>
    <RedirectIcon className="w-[9px] h-[9px]" />
  </div>
  <CloseIcon className="w-3 h-3 transition-all" /> {/* wrapper hover:scale-105 */}
</div>
```
- `h-10 bg-chip` (`#242B33`), link `text-[#F2F4FE] underline hover:text-purple`, external-link
  icon 9×9, close icon 12×12 (`hover:scale-105`).

### `ToastStatus` stages, colors, and step states

`ToastStatus` enum (`src/utils/types.ts`, numeric): `CONFIRM_APPROVAL, APPROVING,
APPROVED, CONFIRM_SUBMIT_TX, TX_SUBMITTED, TX_SUCCESS, VIEW_TX_HASH, APPROVE_ERROR, TX_ERROR`.

`flowConfig` (verbatim from `TransactionToast.tsx`) - each stage's progress color, step 1/2
states, and which panels show. Step types: `IDLE, IN_PROGRESS, DONE, ERROR`.

| Stage | progressColor | step1 | step2 | txDetails | txHash |
|---|---|---|---|---|---|
| `CONFIRM_APPROVAL` | `#4D5966` | IN_PROGRESS | IDLE | no | no |
| `APPROVING` | `#967CC9` | IN_PROGRESS | IDLE | no | no |
| `APPROVED` | `#967CC9` | DONE | IDLE | no | no |
| `CONFIRM_SUBMIT_TX` | `#967CC9` | DONE | IN_PROGRESS | yes | no |
| `TX_SUBMITTED` | `#488FFF` | DONE | IN_PROGRESS | yes | yes |
| `TX_SUCCESS` | `#22C55E` | DONE | DONE | yes | yes |
| `VIEW_TX_HASH` | `#22C55E` | DONE | DONE | no | yes |
| `APPROVE_ERROR` | `#EF4444` | ERROR | IDLE | no | no |
| `TX_ERROR` | `#EF4444` | DONE | ERROR | no | no |

### Timings & auto-dismiss

- Slide + all box resizes: `transition-all duration-500` (500ms).
- Progress-fill on terminal stages: 5s (`extend-width`).
- On `APPROVE_ERROR`, `TX_ERROR`, `VIEW_TX_HASH` the toast auto-closes after **5000ms**
  (`setTimeout(() => setOpenToast(false), 5000)`), matching the 5s progress fill.
- `fade-in` on panel show: 1.5s.

### Recommended demo scripted sequence

To show the widget's full life on the portfolio, cycle a supply-with-approval flow
(~2–3s per step): `CONFIRM_APPROVAL → APPROVING → APPROVED → CONFIRM_SUBMIT_TX →
TX_SUBMITTED → TX_SUCCESS → VIEW_TX_HASH` (then auto-dismiss). For a borrow flow without
approval, start at `CONFIRM_SUBMIT_TX`. Show an error branch occasionally (`TX_ERROR`).

---

## 6. Assets to copy

All under `src/assets/`. Token logos (`src/assets/images/`):

| File | Used for |
|---|---|
| `ovixlogo.svg` | Header wordmark (width 80px) |
| `0VIX-logo.svg` | VIX reward token icon in RewardChip / OVIX APR rows |
| `ETH-logo.svg`, `WBTC-logo.svg`, `DAI-logo.svg`, `USDC-logo.svg`, `USDT-logo.svg`, `MATIC-logo.svg`, `MaticX-logo.svg`, `stMATIC-logo.svg`, `MAI-logo.svg`, `jEUR-logo.svg`, `gDAI-logo.svg`, `vGHST-logo.svg`, `wsteth.svg`, `LDO-logo.svg`/`LDO-logo.png`, `GNS-logo.png` | Per-market token icons (the `underlying.logo`) |
| `ZKEVM-logo.svg`, `zkevm-banner.png`, `polygon-banner-logo.png`, `powered-by-polygon.svg`, `poweredby.svg` | Chain/branding accents |
| `MetaMask-logo.png` | Wallet UI |
| `98432-loading.json` | Lottie loading animation (loading dialog) |
| `src/assets/0vix-bg.png` | Page background glow (referenced from App.css) |

Icons (`src/assets/icons/`): `downarrow.svg` (card expand chevron), `arrow-down.svg`,
`reward.svg`, `rating-star.svg`, `moon.svg`/`sun.svg`, social icons
(`Vectortwitter.svg`, `Vectordiscord.svg`, `Vectortelegram.svg`, `Vectorsocialnet.svg`,
`github.png`, `medium.png`, `twitter.png`, `discord.png`), `maticIcon.svg`, `zkEVM-icon.svg`.

Inline SVG icon components live in `src/assets/svgs.tsx` (import via named exports). The
ones used by the toast, quoted verbatim so they can be pasted directly:

**CircularSuccessIcon** (default color `#16C784`, but toast renders it green via context) -
22×22, single path:
```
d="M18.3146 3.68499C14.2743 -0.355284 7.72478 -0.355284 3.6845 3.68499C-0.355772 7.72527 -0.355772 14.2748 3.6845 18.3151C7.72478 22.3553 14.2743 22.3553 18.3146 18.3151C22.3548 14.2748 22.354 7.72527 18.3146 3.68499ZM16.6296 8.44196L10.3433 14.7291C10.1881 14.8843 9.9776 14.9714 9.75816 14.9714C9.53871 14.9714 9.32825 14.8843 9.17306 14.7291L5.36947 10.9247C5.29263 10.8479 5.23168 10.7567 5.1901 10.6563C5.14851 10.5559 5.12711 10.4483 5.12711 10.3396C5.12711 10.1202 5.21429 9.90969 5.36947 9.75451C5.52465 9.59933 5.73512 9.51215 5.95457 9.51215C6.17403 9.51215 6.3845 9.59933 6.53968 9.75451L9.75816 12.973L15.4594 7.27092C15.5363 7.19409 15.6276 7.13315 15.728 7.09158C15.8284 7.05002 15.9361 7.02865 16.0448 7.02869C16.1535 7.02873 16.2611 7.05017 16.3615 7.09181C16.462 7.13344 16.5532 7.19445 16.63 7.27134C16.7069 7.34823 16.7678 7.4395 16.8094 7.53994C16.8509 7.64039 16.8723 7.74803 16.8723 7.85673C16.8722 7.96544 16.8508 8.07307 16.8091 8.17348C16.7675 8.27389 16.7065 8.36512 16.6296 8.44196Z"
```
**ErrorIcon** - 31×30, fill `#EF4444`:
```
d="M19.385 9L15.5 12.885L11.615 9L9.5 11.115L13.385 15L9.5 18.885L11.615 21L15.5 17.115L19.385 21L21.5 18.885L17.615 15L21.5 11.115L19.385 9ZM15.5 0C7.205 0 0.5 6.705 0.5 15C0.5 23.295 7.205 30 15.5 30C23.795 30 30.5 23.295 30.5 15C30.5 6.705 23.795 0 15.5 0ZM15.5 27C8.885 27 3.5 21.615 3.5 15C3.5 8.385 8.885 3 15.5 3C22.115 3 27.5 8.385 27.5 15C27.5 21.615 22.115 27 15.5 27Z"
```
**RedirectIcon** - viewBox 0 0 10 10, fill `#F2F4FE`:
```
d="M3.33333 0V1.33333H7.72667L0 9.06L0.94 10L8.66667 2.27333V6.66667H10V0H3.33333Z"
```
**CloseIcon** - 14×14, fill `#7C8792`:
```
d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
```
**SortArrowIcon** is used in column headers (see `svgs.tsx` line 3).

---

## 7. Realistic fake data for the demo

The real data comes from `CTokenInfo` (`src/Classes/cTokenClass.ts`) via a global context.
For the recreation, hand-roll static rows. Shape per market row:

```ts
type DemoMarket = {
  symbol: string        // token ticker
  logo: string          // /assets/<TOKEN>-logo.svg
  supplyApy: string     // e.g. "3.42%"
  borrowApy: string     // e.g. "5.18%"
  ovixApr: string       // reward APR, e.g. "2.10%"
  yourSupplied?: string // "1.25 ETH"  + usd "($3.1K)"
  yourBorrowed?: string
  totalSupplied: string // "12.4M"
  totalBorrowed: string
  totalSuppliedUsd: string // "$31.2M"
  collateralFactor: string // LTV, e.g. "82.5%"
  liquidity: string     // "$4.8M"
  walletBalance: string // "0.42 ETH"
  isCollateral: boolean
}
```

Believable 0VIX market set (Polygon assets - these are the real tickers used):

| symbol | supplyApy | borrowApy | ovixApr | total supplied (USD) | LTV |
|---|---|---|---|---|---|
| ETH  | 2.14% | 3.89% | 1.42% | $28.4M | 82.5% |
| WBTC | 0.87% | 2.34% | 0.95% | $11.9M | 75.0% |
| USDC | 4.62% | 6.71% | 3.10% | $42.1M | 85.0% |
| USDT | 4.38% | 6.55% | 2.88% | $33.7M | 85.0% |
| DAI  | 4.05% | 6.12% | 2.55% | $19.3M | 80.0% |
| MATIC| 3.21% | 5.44% | 4.20% | $9.8M  | 65.0% |
| stMATIC | 3.88% | 5.02% | 3.70% | $6.4M | 60.0% | (also shows LDO reward)
| MaticX | 3.71% | 4.95% | 3.55% | $5.1M | 60.0% |
| MAI  | 1.24% | 3.02% | 1.10% | $3.2M  | 70.0% |
| jEUR | 2.02% | 4.18% | 1.65% | $2.1M  | 65.0% |
| gDAI | 5.10% | 7.20% | 4.80% | $1.8M  | 70.0% | (also shows GNS reward)

For "Your positions" (Supplied Assets / Borrowed Assets), pick 2–3 rows, e.g.
supplied `1.85 ETH ($5.7K)` and `3,200 USDC ($3.2K)`; borrowed `1,000 DAI ($1.0K)`.

Count-dashboard totals (believable): `TOTAL SUPPLIED $184.2M`, `TOTAL BORROWED $96.7M`,
`YOUR SUPPLIED $8.9K`, `YOUR BORROWS $1.0K`. Value counters slowly tick upward (the real
`ExtrapolatedNumber` extrapolates by APY/interest each frame).

Toast demo payload for a supply-with-approval on ETH:
```ts
{ transactionType: 'supply', includesApproval: true, amount: '1.5',
  symbol: 'ETH', logo: '/assets/ETH-logo.svg',
  supplyApy: '2.14', ltv: '82.50', pctSupplyBorrowed: '34.10',
  txHash: '0x9f3c…a21b' }
```
Line items rendered: `Amount 1.5 ETH`, `Supply APY 2.14%`, `Loan-To-Value 82.50%`,
`% of Supply Borrowed 34.10%`, hash bar "View on Polygonscan".
