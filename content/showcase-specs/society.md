# Vanta Society - Pixel-Perfect Web Recreation Spec

Source repo (read-only): `/Users/sujink/Development/Vanta/vanta-society`
Target: a web recreation, rendered **inside an iPhone frame**, of two screens:
1. **Home screen** (`HomeScreen`)
2. **Streak detail** (full-screen modal `StreakDetailModal`)

The app is Expo / React Native using **twrnc** (`tailwind-react-native-classnames`) via a configured `tw` instance. Almost all styling is Tailwind-like classes plus inline style objects. This spec quotes those verbatim and gives you the exact conversions you need.

---

## 0. CRITICAL GLOBAL RULES (this is why v1 "looked cheap")

### 0.1 The `tw` engine and its CUSTOM scales
`tw` is created in `constants/tw.ts` with an **overridden fontSize scale** (Inter has a large x-height, so every size was shrunk). You MUST use these exact px values, NOT default Tailwind:

```
xs   = 11px    (Tailwind default is 12)
sm   = 13px    (default 14)
base = 15px    (default 16)
lg   = 17px    (default 18)
xl   = 18px    (default 20)
2xl  = 22px    (default 24)
3xl  = 28px    (default 30)
micro= 10px
4xl  = 36px
hero = 140px
```

Spacing: twrnc uses the standard Tailwind 4px scale. `1` = 4px, `2` = 8px, `3` = 12px, `4` = 16px, `5` = 20px, `6` = 24px, `10` = 40px, `12` = 48px, `24` = 96px. `px-6` = 24px left/right padding. `py-3` = 12px top/bottom. `h-4` = 16px, `h-10` = 40px spacer views.

Radii: `rounded-lg` = 8px, `rounded-xl` = 12px, `rounded-2xl` = 16px, `rounded-full` = 9999px.

### 0.2 Font family + weight interaction (KEY FONT BUG)
In twrnc, `font-primary` sets `fontFamily: "Inter_400Regular"`. A **separate** class like `font-medium` sets `fontWeight: "500"`. On native these stack. **On the web, do NOT rely on `font-weight` against a single-weight @font-face** - that produces fake/synthetic bold and is exactly what made v1 look cheap. Instead, map each `font-primary` + weight combination to the correct dedicated Inter weight file:

| Classes in source | Use this font | CSS |
|---|---|---|
| `font-primary` (alone) | Inter Regular | `font-family:Inter; font-weight:400` |
| `font-primary font-light` | Inter Light | 300 |
| `font-primary font-medium` | Inter Medium | 500 |
| `font-primary font-semibold` | Inter SemiBold | 600 |
| `font-primary font-bold` | Inter Bold | 700 |
| `font-primary-medium` | Inter Medium | 500 |
| `font-primary-bold` | Inter Bold | 700 |

Load each Inter weight as its own `@font-face` with the matching numeric `font-weight`, so the browser picks the real file. **Never** let the browser synthesize. Also set `-webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility` on the frame root.

### 0.3 `tracking-*` (letter-spacing)
twrnc computes letterSpacing as `em * fontSize`. Tailwind values used here:
- `tracking-wide` = 0.025em
- `tracking-widest` = 0.1em
- `tracking-[4px]` = literal 4px

On web, use `letter-spacing` in `em` directly (`0.1em`, `0.025em`) or the literal px. These are usually on tiny uppercase labels - getting them right matters a lot visually.

### 0.4 `text-white/NN` opacity
`text-white/50` = `color: rgba(255,255,255,0.5)`. Same pattern for `/80`, `/60`, `/40`, `/30`, `/25`, `/20`, `/15`, `/10`, `/5`, `/3`. Convert every `/NN` to the exact rgba. Border `border-white/10` = `rgba(255,255,255,0.10)`. `bg-white/10`, `bg-black/20` likewise.

### 0.5 Colors (`constants/theme.ts`)
```
primary       = #FF5C2A   (orange - accent, rarely used on these two screens)
black         = #000000   (app background, all cards)
white         = #FFFFFF
textPrimary   = #FFFFFF
textSecondary = #979797
background     = #000000
```
Both screens are pure black `#000000` background. Card backgrounds are also black with faint white borders - the depth comes from a subtle **radial gradient** (see GlassCard §5.6), not from lighter fills.

### 0.6 iPhone frame
Render at a logical viewport width of **393px** (iPhone 15 / 16 base width; the design uses `Dimensions.get("window").width` = 393 on that class of device). Height ~852px. Status bar area is translucent - content starts near the top with the header's own `py-3`. Use `overflow: hidden` and rounded corners on the device frame; the screen content clips to it. Horizontal-scroll elements (date selector) scroll inside their own container; the page body must never scroll horizontally.

---

## 1. SCREEN LAYOUT INVENTORY

### 1.1 Home screen - `components/HomeScreen/HomeScreen.tsx`
Outer: `<View style={tw`flex-1 bg-black`}>` wrapping a vertical `ScrollView` with `contentContainerStyle={tw`pb-24`}` (96px bottom padding), `showsVerticalScrollIndicator={false}`.

Vertical order (verbatim from JSX, ignore the `__DEV__` debug buttons block - never render it):
```
<HomeHeader />
<View style={tw`h-4`} />            // 16px spacer
<DateSelectorWidget .../>
<View style={tw`h-10`} />           // 40px spacer
<CharacterStateSection />
<View style={tw`h-10`} />           // 40px spacer
<BeaconWidget />
<DynamicWidget ... />               // render the DaytimeTasksWidget variant
<View style={tw`h-10`} />           // 40px spacer
```
(The `ChallengeCompletionModal` at the top is an off-screen modal - ignore.)

### 1.2 Streak detail - `components/StreakDetail/StreakDetailModal.tsx` + `StreakDetailContent.tsx`
Full-screen modal over a `rgba(0,0,0,0.95)` backdrop. Vertically centered content (hero streak number, milestone progress bar, last-7-days cadence), plus a "Close" secondary button pinned near the bottom.

---

## 2. COMPONENT-BY-COMPONENT BREAKDOWN (verbatim styles)

### 2.1 HomeHeader - `components/HomeScreen/HomeHeader.tsx`
Container: `<View style={tw`flex-row items-center justify-between px-6 py-3`}>` (24px h-pad, 12px v-pad, space-between row).

**Left - Vanta logo:**
```jsx
<Image
  source={require("@/assets/images/v2/vanta-logo.png")}
  style={tw`w-10 h-10`}          // 40x40px
  resizeMode="contain"
/>
```
Logo native pixels are 897×524 (wide). Rendered in a 40×40 box with `contain`, so it letterboxes - effective rendered size ≈ 40×23.4, centered. Use `object-fit: contain` in a 40×40 box.

**Right - Streak pill (Pressable, opens StreakDetailModal):**
```jsx
style={({ pressed }) => [
  tw`flex-row items-center rounded-full px-3 py-2 border border-white/10`,
  { backgroundColor: 'rgba(0, 0, 0, 0.95)', opacity: pressed ? 0.7 : 1 },
]}
```
Contents: Phosphor `Fire` icon `size={18} weight="regular" color="rgba(255, 255, 255, 0.8)"`, then
```jsx
<Text style={tw`text-white/80 font-primary font-medium text-sm ml-1`}>
  {winterArcStats.streak}
</Text>
```
So: pill = 12px h-pad, 8px v-pad, radius full, border `rgba(255,255,255,0.1)`, bg `rgba(0,0,0,0.95)`. Text = Inter **Medium 500**, 13px, `rgba(255,255,255,0.8)`, 4px left margin. Fire icon regular-weight, 18px, `rgba(255,255,255,0.8)`.

**Fire icon:** Phosphor "Fire" (`phosphor-react-native`). Recreate with an inline SVG flame. `weight="regular"` = 1.5px stroke, no fill (outline flame). In StreakDetailContent it's `weight="fill"` (solid). Grab the exact Phosphor "fire" path from phosphoricons.com (regular = stroked, fill = filled) so the shape matches - do not substitute a generic flame emoji.

### 2.2 DateSelectorWidget - `components/HomeScreen/DateSelectorWidget.tsx`
Constants (verbatim):
```
SCREEN_WIDTH   = Dimensions.get("window").width      // use 393
BAR_WIDTH      = 12
BAR_GAP        = 6
BAR_TOTAL_WIDTH= 18
BAR_HEIGHT     = 40
SCALE_SELECTED = 1.2
FADE_WIDTH     = SCREEN_WIDTH * 0.4                   // 157.2
SCALE_OVERFLOW = (40*1.2 - 40)/2 = 4
WIDGET_HEIGHT  = 40 + 4*2 = 48
FOCUS_LEFT     = 24
FOCUS_CENTER   = SCREEN_WIDTH/2 - BAR_WIDTH/2         // 190.5
FOCUS_RIGHT    = SCREEN_WIDTH - 24 - BAR_WIDTH        // 357
```

**Label block** (challenge active - use this branch):
```jsx
<Text style={tw`font-primary text-white text-xl font-medium px-6`}>
  Day {visualDay} / {totalDays}
</Text>
<Text style={tw`font-primary text-white/50 text-sm mt-1 mb-4 px-6`}>
  {dateSubtext}
</Text>
```
- Line 1: Inter Medium 500, **18px** (`text-xl`=18), white, px-6.
- Line 2: Inter Regular 400, **13px** (`text-sm`), `rgba(255,255,255,0.5)`, marginTop 4, marginBottom 16, px-6.
- `dateSubtext` format: `"Today, July 22"` / `"Yesterday, July 21"` / `"Tomorrow, July 23"` / else `"Tuesday, July 22"` (moment: `dddd, MMMM D`).

**Bars container:** `width: 393, height: 48`, `position: relative`.

Each bar (currently-focused one is scaled up via scroll interpolation):
- Track: `width 12, height 40, backgroundColor "rgba(255,255,255,0.15)", borderRadius 4, overflow hidden, justifyContent flex-end`.
- Fill (bottom-anchored): `width 100%, height = progress*40, backgroundColor "rgba(255,255,255,0.8)", borderRadius 4`.
- Bars are laid out in a `flex-row items-center` with `marginRight: 6` each.
- Opacity per bar interpolates `0.4 → 1 → 0.4` around the centered bar; scaleY `1 → 1.2 → 1`. For a **static** web mock: render the centered/selected bar at opacity 1 and scaleY 1.2, neighbors falling to 0.4 opacity, scale 1 (linear ramp over ~2 bars each side).

**Edge fades (LinearGradient):** width `157.2`, full height, `zIndex 30`, `pointerEvents none`.
- Left: colors `["#000000","#000000","transparent"]`, locations `[0, 0.2, 1]`, horizontal (left→right). CSS: `linear-gradient(to right, #000 0%, #000 20%, transparent 100%)`.
- Right: colors `["transparent","#000000","#000000"]`, locations `[0, 0.8, 1]`. CSS: `linear-gradient(to right, transparent 0%, #000 80%, #000 100%)`, anchored right.

For the mock, position the selected bar at `FOCUS_CENTER` (mid-arc). Show ~30 bars. Progress values are 0–1; use the fake data in §6.

### 2.3 CharacterStateSection - `components/HomeScreen/CharacterStateSection.tsx`
```jsx
<View style={tw`items-center justify-center px-6`}>
  <Image source={characterImage} style={tw`w-[200px] h-[200px]`} resizeMode="contain" />
</View>
```
Centered, 200×200px, `object-fit: contain`. Image source is `CHARACTER_IMAGES[characterState.imageIndex]` where imageIndex ∈ 1..5, default 1. Character PNGs are 949×869 native (roughly square, slightly wide). For the mock use **`character/3.png`** (mid-evolution) or `1.png`. Copy all five so the state can vary.

### 2.4 BeaconWidget stack - `components/HomeScreen/beacon/`
Wrapper: `<AutoHeightView style={tw`px-4 mt-4`}>` (16px h-pad, 16px top margin). When beacons exist:
```jsx
<View style={{ height: CARD_HEIGHT + 54 }}>   // 140 + 54 = 194px
  <HintCard index={4} />
  <HintCard index={3} />
  {reversed beacons -> <StackedCard index=0..2 />}
</View>
```

**Stack geometry - `beacon/constants.ts` (verbatim):**
```
CARD_HEIGHT     = 140
SWIPE_THRESHOLD = 100
STACK_CONFIG = {
  scale:      [1.0, 0.96, 0.92, 0.88, 0.84],
  translateY: [0,   12,   24,   36,   48],
  opacity:    [1,   0.7,  0.55, 0.7,  0.6],
}
```
Index 0 = top/front card (full scale, y=0, opacity 1). Index 1,2 = cards behind (smaller, pushed down 12/24px, dimmer). Index 3,4 = the two `HintCard` skeletons further back. All cards are `position: absolute; width: 100%`, stacked with `zIndex = totalCards - index` (top card highest). Each transforms: `scale(...) translateY(...)` and `opacity(...)` from the arrays.

**BeaconCard → StateBeacon - `beacon/StateBeacon.tsx`** (character_evolution type):
```jsx
<View style={[tw`bg-black rounded-2xl`, {
  borderWidth: 0.5,
  borderColor: isTop ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.4)",
}]}>
```
- Close button (top card only): absolute `top-3 right-3` (12px), Ionicons `close` size 20, `rgba(255,255,255,0.5)`.
- Row: `flex-row items-start px-6 py-6` (24px padding all around).
  - Icon box: `w-14 h-14 rounded-xl mr-4 items-center justify-center overflow-hidden bg-white/10` → 56×56, radius 12, right margin 16, bg `rgba(255,255,255,0.1)`. Inside: character image `w-14 h-14` (56×56) `resizeMode="cover"`.
  - Text column: `flex-1 pr-6`.
    - Title: `text-white/50 font-primary font-medium text-xs uppercase tracking-widest mb-1` → Inter **Medium 500**, 11px, `rgba(255,255,255,0.5)`, UPPERCASE, letter-spacing 0.1em, margin-bottom 4. (e.g. `"STATE EVOLUTION"`)
    - Message: `text-white font-primary text-base leading-5` → Inter Regular 400, 15px, white, line-height 20px. (e.g. `"Your current state will evolve in the next 3 days"`)

**BrandBeacon - `beacon/BrandBeacon.tsx`** (brand_unlock): identical layout; icon box shows a logo from URL with `resizeMode="contain"`, fallback Ionicons `storefront`. Title e.g. `"BRAND UNLOCK"`, message e.g. `"Nuvie unlocking in 3 days"`.

**HintCard - `beacon/HintCard.tsx`** (skeleton behind cards):
```jsx
outer: tw`bg-black rounded-2xl` + { borderWidth:0.5, borderColor:"rgba(255,255,255,0.5)" }
row:   tw`flex-row items-center px-6 py-6`
  <View style={tw`w-18 h-18 rounded-xl mr-4 bg-white/5`} />   // 72x72, radius12, bg rgba(255,255,255,0.05)
  <View style={tw`flex-1`}>
    <View style={tw`h-5 w-32 rounded bg-white/5 mb-2`} />     // 20x128 bar
    <View style={tw`h-4 w-48 rounded bg-white/5`} />          // 16x192 bar
  </View>
```
(`rounded` = 4px. `w-18/h-18` = 72px, `w-32`=128, `w-48`=192, `h-5`=20, `h-4`=16.)

**Beacon animations:** stack settle uses Reanimated `withTiming(..., { duration: 250 })` when index changes. Enter `FadeIn.duration(200)`, exit `FadeOut.duration(150)`. Swipe: top card only, drag right (positive X only), `translateX = max(0, dragX)`, opacity `1 - min(translateX/200, 0.6)`. Release past `SWIPE_THRESHOLD` (100) → animate `translateX` to 400 over 200ms + opacity to 0 over 200ms, then dismiss; else snap back over 200ms. For the mock, a subtle idle state is fine; optionally implement the right-swipe-to-dismiss for polish.

### 2.5 DynamicWidget → DaytimeTasksWidget - `components/HomeScreen/widgets/DaytimeTasksWidget.tsx`
`DynamicWidget` routes by `widgetState`; use the **`daytime`** case = `DaytimeTasksWidget`. Outer `<View style={tw`px-3`}>` (12px h-pad) wrapping a `GlassCard gradientPosition="bottom"` (see §5.6). Inside GlassCard: `<View style={tw`p-4`}>` (16px).

**Countdown header block** (`mb-5` = 20px):
```jsx
<View style={tw`bg-black/20 rounded-xl border border-white/5 overflow-hidden mb-3`}>
  <View style={tw`py-4 flex-row items-center justify-center gap-2 px-3`}>
    <Ionicons name="moon-outline" size={14} color="rgba(255, 255, 255, 0.6)" />
    <Text style={tw`text-white/60 font-primary text-xs tracking-wide uppercase`}>
      {"Check-in opens in "}
      <Text style={tw`text-white/80 font-primary font-medium`}>
        {"5 HOURS 12 MINS"}   // timeUntilEvening.toUpperCase()
      </Text>
    </Text>
  </View>
  {/* progress line */}
  <View style={[tw`h-0.5`, { backgroundColor: "rgba(255,255,255,0.05)" }]}>
    <View style={[tw`h-full`, { width: `${pct}%`, backgroundColor: "rgba(255,255,255,0.2)" }]} />
  </View>
</View>
```
- Box: bg `rgba(0,0,0,0.2)`, radius 12, border `rgba(255,255,255,0.05)`, overflow hidden.
- Inner row: 16px v-pad, 12px h-pad, centered, 8px gap. Moon icon (Ionicons `moon-outline`, 14px, `rgba(255,255,255,0.6)`).
- Label: Inter Regular 400, 11px, `rgba(255,255,255,0.6)`, UPPERCASE, letter-spacing 0.025em. The time portion is Inter **Medium 500**, `rgba(255,255,255,0.8)`.
- Progress line: 2px tall (`h-0.5`), track `rgba(255,255,255,0.05)`, fill `rgba(255,255,255,0.2)` at `progressFill%` (elapsed minutes since midnight / (19h*60)). Use ~65% for the mock.

Then:
```jsx
<Text style={tw`mt-4 text-white/30 font-primary text-xs tracking-widest uppercase`}>
  TODAY'S ROUTINE
</Text>
```
Inter Regular 400, 11px, `rgba(255,255,255,0.3)`, UPPERCASE, letter-spacing 0.1em, margin-top 16.

**Task list** (`gap-4` = 16px between rows). Each row `flex-row items-start`:
```jsx
<View style={tw`mr-5 ml-1 mt-0.5`}>   // icon: mr20 ml4 mt2
  <IconComponent size={18} color={isCompleted ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.3)"} />
</View>
<View style={tw`flex-1`}>
  <Text style={[
    tw`font-primary text-sm mb-1`,               // Inter 400, 13px, mb4
    isCompleted ? tw`text-white/30 line-through` : tw`text-white/80`
  ]} numberOfLines={2}>
    {taskCommand}
  </Text>
</View>
```
- Task text: Inter Regular 400, 13px. Done = `rgba(255,255,255,0.3)` + line-through. Todo = `rgba(255,255,255,0.8)`.
- Icons come from `components/icons/TaskIcons.tsx` (`getTaskIcon(taskName)`), 18px. Use simple line icons (e.g. water drop, book, dumbbell, sun) matching task type; color as above.
- Empty state (only if no tasks): centered `"All tasks reviewed"` (Inter 400, 13px, `rgba(255,255,255,0.6)`) + `"Check back at 7 PM to complete your day"` (11px, `rgba(255,255,255,0.3)`, mt8).

**Footer:**
```jsx
<View style={[tw`pt-4 mt-4 items-center`, { borderTopWidth:1, borderTopColor:"rgba(255,255,255,0.05)" }]}>
  <Text style={tw`text-white/30 text-xs uppercase tracking-widest font-primary`}>Tap to customize</Text>
</View>
```
Top border `rgba(255,255,255,0.05)`, 16px pad/margin. Text Inter 400, 11px, `rgba(255,255,255,0.3)`, UPPERCASE, letter-spacing 0.1em.

### 2.6 StreakDetailContent - `components/StreakDetail/StreakDetailContent.tsx`
Root: `<View style={tw`flex-1 justify-center`}>` (vertically centered column).

**Hero block** (`items-center pb-2`):
- Label row `flex-row items-center gap-2 mb-2`: Phosphor `Fire` size 20 `weight="fill"` color `rgba(255,255,255,0.5)`, then `<Text style={tw`text-white/40 text-[10px] font-primary font-light uppercase tracking-[4px]`}>Streak</Text>` → Inter **Light 300**, 10px, `rgba(255,255,255,0.4)`, UPPERCASE, letter-spacing **4px**.
- Streak number (`AnimatedStreakNumber`):
```jsx
<Animated.Text style={[tw`text-white font-primary font-bold text-center`, {
  fontSize: 96, lineHeight: 104, opacity, transform:[{scale}]
}]}>{value}</Animated.Text>
```
Inter **Bold 700**, **96px**, line-height 104, white, centered.
- Current milestone name (if streak ≥ first milestone): `<Text style={tw`text-white/60 font-primary font-medium text-sm mt-1`}>` → Inter Medium 500, 13px, `rgba(255,255,255,0.6)`, mt4. e.g. `"One Week Strong"`.

**MilestoneProgressBar** (`px-6 mt-12` → 24px h-pad, 48px top):
- Track: `h-1.5 rounded-full overflow-hidden`, bg `rgba(255,255,255,0.06)` → 6px tall, radius full.
- Fill: `h-full rounded-full`, bg `rgba(255,255,255,0.7)`, width = progress% (see §6 formula). Animates from 0→target over 800ms, delay 400ms, `Easing.out(Easing.cubic)`.
- Row below `flex-row justify-between items-start mt-3`:
  - Left: `<Text style={tw`text-white/40 text-[10px] font-primary font-light uppercase tracking-widest`}>{daysToGo} days to go</Text>` - Inter Light 300, 10px, `rgba(255,255,255,0.4)`, UPPERCASE, 0.1em.
  - Right column `items-end`:
    - `<Text style={tw`text-white/50 text-[10px] font-primary font-medium uppercase tracking-widest`}>{next.name}</Text>` - Inter Medium 500, 10px, `rgba(255,255,255,0.5)`.
    - `<Text style={tw`text-white/25 text-[9px] font-primary font-light uppercase tracking-widest mt-0.5`}>Next milestone</Text>` - Inter Light 300, **9px**, `rgba(255,255,255,0.25)`, mt2.

**CadenceRow** (`px-6 mt-12`): a `flex-row justify-between` of 7 day-circles:
```jsx
<View style={[tw`w-9 h-9 rounded-full items-center justify-center`, {
  backgroundColor: day>0 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.03)",
  borderWidth: 1,
  borderColor:   day>0 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
}]}>
  <Text style={[tw`font-primary font-medium text-[11px]`, day>0 ? tw`text-white/80` : tw`text-white/20`]}>
    {dayLabel}   // S M T W T F S rotated to real last-7-days
  </Text>
</View>
```
Circles 36×36 (`w-9 h-9`), radius full, 1px border. Active (day>0): bg `rgba(255,255,255,0.12)`, border `rgba(255,255,255,0.25)`, text `rgba(255,255,255,0.8)`. Inactive: bg `rgba(255,255,255,0.03)`, border `rgba(255,255,255,0.08)`, text `rgba(255,255,255,0.2)`. Labels Inter Medium 500, 11px.
Below: `<Text style={tw`text-white/30 text-[10px] font-primary font-light uppercase tracking-widest mt-4 text-left`}>Last 7 Days</Text>` - Inter Light 300, 10px, `rgba(255,255,255,0.3)`, 0.1em, mt16.

Day labels: `["S","M","T","W","T","F","S"]` indexed by `moment().subtract(i,"days").day()` for i=6..0 - i.e. the weekday initials of the last 7 calendar days ending today, left→right. For a mock ending on a Tuesday: `["W","T","F","S","S","M","T"]`.

### 2.7 StreakDetailModal chrome - `StreakDetail/StreakDetailModal.tsx`
- Backdrop: `StyleSheet.absoluteFill`, `backgroundColor: "rgba(0,0,0,0.95)"`, fades opacity 0→1 over 400ms. Tapping backdrop dismisses.
- Content wrapper: `flex-1`, animated `opacity` 0→1 (500ms), `scale` 0.92→1 (spring damping 20 stiffness 200), `translateY` 30→0 (500ms).
- Bottom: `<View style={tw`px-6 pb-12 pt-4`}>` containing `<Button title="Close" variant="secondary" />` (see §5.7). 24px h-pad, 48px bottom, 16px top.

---

## 3. FONTS - file paths to copy + @font-face plan

### 3.1 Local font files to COPY (from repo `assets/fonts/`)
| Source path | Family | Used where |
|---|---|---|
| `assets/fonts/TussilagoExtraLight.otf` | Tussilago ExtraLight | Typography theme only - not on these two screens, copy for completeness |
| `assets/fonts/TussilagoLight.otf` | Tussilago Light | - |
| `assets/fonts/TussilagoRegular.ttf` | Tussilago Regular | - |
| `assets/fonts/TussilagoBold.otf` | Tussilago Bold | `Typography.Title/Heading` (32/24px) - not used on Home/Streak, but copy |
| `assets/fonts/TussilagoHeavy.otf` | Tussilago Heavy | - |
| `assets/fonts/AoiMonoCompact.otf` (+ `.ttf`) | Aoi Mono Compact | monospace numerals elsewhere - copy |

**Home + Streak screens use ONLY Inter.** Tussilago/Aoi/Montserrat are not referenced by any element on these two screens (verified: every `font-*` class on them is `font-primary` = Inter). Copy Tussilago/Aoi anyway if you want the frame chrome/expansion, but Inter is mandatory.

### 3.2 Inter weight files to COPY (from repo `node_modules/@expo-google-fonts/inter/`)
| Source path | weight |
|---|---|
| `node_modules/@expo-google-fonts/inter/300Light/Inter_300Light.ttf` | 300 |
| `node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf` | 400 |
| `node_modules/@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf` | 500 |
| `node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf` | 600 |
| `node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf` | 700 |

(Montserrat 300/400/500/600/700/800 live at `node_modules/@expo-google-fonts/montserrat/<weight>/Montserrat_*.ttf` - copy only if you extend beyond these screens; not needed here.)

### 3.3 @font-face plan (web)
Copy the five Inter TTFs into the web project's `public/fonts/` and declare:
```css
@font-face { font-family:"Inter"; font-weight:300; font-style:normal; src:url("/fonts/Inter_300Light.ttf") format("truetype"); font-display:swap; }
@font-face { font-family:"Inter"; font-weight:400; font-style:normal; src:url("/fonts/Inter_400Regular.ttf") format("truetype"); font-display:swap; }
@font-face { font-family:"Inter"; font-weight:500; font-style:normal; src:url("/fonts/Inter_500Medium.ttf") format("truetype"); font-display:swap; }
@font-face { font-family:"Inter"; font-weight:600; font-style:normal; src:url("/fonts/Inter_600SemiBold.ttf") format("truetype"); font-display:swap; }
@font-face { font-family:"Inter"; font-weight:700; font-style:normal; src:url("/fonts/Inter_700Bold.ttf") format("truetype"); font-display:swap; }
```
Set the frame body to `font-family:"Inter",sans-serif`. Because every weight is a real file, `font-weight:300/400/500/600/700` map to the right glyphs with no synthesis. (Optional: convert TTF→woff2 for size; keep the same family/weight declarations.)

---

## 4. COMPLETE ASSET COPY LIST

All under repo `assets/images/v2/`. Native pixel dims and rendered sizes noted.

| Source file | Native px | Rendered | Used by |
|---|---|---|---|
| `assets/images/v2/vanta-logo.png` | 897×524 | 40×40 box, `contain` (≈40×23) | HomeHeader logo |
| `assets/images/v2/character/1.png` | 949×869 | 200×200 `contain` (Home); 56×56 `cover` (beacon) | CharacterStateSection / StateBeacon `character_1` |
| `assets/images/v2/character/2.png` | 949×869 | same | `character_2` |
| `assets/images/v2/character/3.png` | 949×869 | same | `character_3` |
| `assets/images/v2/character/4.png` | 949×869 | same | `character_4` |
| `assets/images/v2/character/5.png` | 949×869 | same | `character_5` |

Copy **all five character PNGs + the logo**. The character images are the visual centerpiece - do not approximate or regenerate them; copy the exact PNGs (with their transparency).

No background textures are used on these two screens (background is flat `#000000`). `mobius-dark.png`, `unlocks/*`, `books/*` are NOT on Home/Streak - skip. Brand-beacon logos load from remote URLs (e.g. `https://res.cloudinary.com/dxnvxcnur/image/upload/v1769935478/nuvie-logo_ev6ju7.png`) - if you render a brand beacon, download that logo locally.

Icons (recreate as inline SVG, do NOT ship an icon font):
- Phosphor `Fire` - regular (outline) in header pill; fill (solid) in streak hero. Get exact paths from phosphoricons.com.
- Ionicons `moon-outline` (14px), `close` (20px), `storefront`/`person` fallbacks.
- Task icons from `components/icons/TaskIcons.tsx` (18px line icons per task type).

---

## 5. ANIMATION SPECS (with exact configs)

### 5.1 Streak count-up / hero pop - `AnimatedStreakNumber` (StreakDetailContent)
On mount, parallel:
- `scale`: 0.5 → 1, `Animated.spring({ damping:12, stiffness:150, delay:200 })`
- `opacity`: 0 → 1, `Animated.timing({ duration:400, delay:200 })`
(It's a scale/fade pop, not a digit count-up.) Web: 200ms delay, then spring-like scale from 0.5→1 (a CSS spring/`cubic-bezier(0.34,1.56,0.64,1)` over ~500ms approximates damping12/stiffness150) + 400ms fade.

### 5.2 Milestone progress bar fill
`width` 0 → target%, `Animated.timing({ duration:800, delay:400, easing: Easing.out(Easing.cubic) })`, `useNativeDriver:false`. Web: `transition: width 800ms cubic-bezier(0.215,0.61,0.355,1)` starting 400ms after open.

### 5.3 Streak modal open - `StreakDetailModal`
- Backdrop opacity 0→1: `timing({ duration:400 })`.
- Content parallel: opacity 0→1 `timing({ duration:500 })`; scale 0.92→1 `spring({ damping:20, stiffness:200 })`; translateY 30→0 `timing({ duration:500 })`.
- Dismiss: opacity→0 (200ms), scale→0.95 (200ms), translateY→20 (200ms), backdrop→0 (300ms).
- Haptic `impactAsync(Light)` on open (ignore on web).

### 5.4 Beacon stack - `StackedCard`
- Position settle on index change: `withTiming(target, { duration:250 })` for scale/translateY/opacity to `STACK_CONFIG[index]`.
- Enter `FadeIn.duration(200)`, exit `FadeOut.duration(150)`.
- Swipe-to-dismiss (top card): right-only drag, opacity `1 - min(x/200, 0.6)`; release >100px → `translateX→400` (200ms) + `opacity→0` (200ms) then remove; else snap back (200ms).

### 5.5 DateSelector scroll interpolation
Per-bar `opacity` outputRange `[0.4, 1, 0.4]` and `scaleY` `[1, 1.2, 1]` across a 1-bar (18px) window on each side, clamped. `snapToInterval = 18`, `decelerationRate="fast"`. Selection haptic per bar crossed (ignore on web). For a static mock, bake the interpolation at the resting selected position.

### 5.6 GlassCard radial gradient - `components/GlassCard.tsx`
Card = `overflow-hidden rounded-2xl` (16px) with an SVG radial gradient fill behind content and a `border border-white/3` (`rgba(255,255,255,0.03)`) inner border. Gradient (`gradientPosition="bottom"`):
- `RadialGradient cx="50%" cy="85%" rx="80%" ry="60%"`, stops: `0% → rgba(28,28,28,1)`, `100% → rgba(8,8,8,1)`.
CSS: `background: radial-gradient(80% 60% at 50% 85%, rgb(28,28,28) 0%, rgb(8,8,8) 100%)`. Press animation: scale to 0.99 spring (tension100 friction10) - optional on web.

### 5.7 Button (secondary) - `components/Button.tsx`
Secondary variant: `w-full rounded-full overflow-hidden`, SVG radial gradient `cx50% cy50% rx50% ry80%` stops `#1a1a1a → #111111` → CSS `radial-gradient(50% 80% at 50% 50%, #1a1a1a, #111111)`. Padding `py-4 px-8` (16/32). Label centered in `h-6` row, Inter Medium 500, 15px (`text-base`), white. Press: scale→0.98 + white glow overlay opacity 0→0.05.

---

## 6. FAKE DATA (matching real shapes)

```ts
// winterArcStats  (contexts/GlobalContext.tsx, hooks/useWinterArcStats.ts)
const winterArcStats = {
  streak: 7,                                    // header pill + streak hero
  streakCadenceLast7Days: [0, 1, 1, 1, 0, 1, 1], // 7 ints, 0/1, oldest→newest (today last)
};

// Challenge / date selector  (GlobalContext)
const currentDay = 24;      // "Day 24 / 66"
const totalDays  = 66;
const visualDay  = 24;
const dateSubtext = "Today, July 22";  // moment dddd/Today/Yesterday/Tomorrow, "MMMM D"

// DateSelector progress bars: one per day 1..currentDay, progress 0..1
// (completedTasks / activeTasks that day). Sample ~30-bar window ending at day 24:
const dayProgress = [
  0.5, 1, 1, 0.66, 1, 1, 0.33, 1, 1, 1, 0.5, 1, 1, 1, 0.75,
  1, 0.66, 1, 1, 1, 0.4, 1, 1, 0.6   // day 24 (selected, centered)
]; // values are progress fractions -> fill height = frac * 40px

// Character state  (hooks/useCharacterState.ts -> CharacterStateConfig)
const characterState = { imageIndex: 3 };  // 1..5 ; picks character/3.png

// Beacon notifications  (types/gamification BeaconNotification) - render 1-2
const beacons = [
  {
    id: "beacon_state_1",
    type: "character_evolution",       // -> StateBeacon
    priority: 20,
    title: "STATE EVOLUTION",
    message: "Your current state will evolve in the next 3 days",
    imageKey: "character_4",           // key into CHARACTER_IMAGES
    createdAt: "2026-07-22T09:00:00.000Z",
  },
  {
    id: "beacon_brand_1",
    type: "brand_unlock",              // -> BrandBeacon
    priority: 15,
    title: "BRAND UNLOCK",
    message: "Nuvie unlocking in 3 days",
    imageKey: "https://res.cloudinary.com/dxnvxcnur/image/upload/v1769935478/nuvie-logo_ev6ju7.png",
    createdAt: "2026-07-22T09:00:00.000Z",
  },
]; // BeaconWidget shows first 3, top card index 0 = beacons[0]

// DaytimeTasks  (hooks/useTasks -> tasks; utils/taskHelpers constructTaskCommand)
const timeUntilEvening = "5 hours 12 mins";   // uppercased in the time span
const progressFill = 0.68;                     // 0..1 progress line
const tasks = [
  { id: 1, taskName: "hydrate",  taskText: "Drink water",        status: "done",    command: "Drink 500ml water" },
  { id: 2, taskName: "read",     taskText: "Read",               status: "todo",    command: "Read 10 pages" },
  { id: 3, taskName: "workout",  taskText: "Train",              status: "todo",    command: "Train 45 minutes" },
  { id: 4, taskName: "cold",     taskText: "Cold exposure",      status: "todo",    command: "Cold shower 2 minutes" },
  { id: 5, taskName: "meditate", taskText: "Meditate",           status: "done",    command: "Meditate 10 minutes" },
]; // done rows: rgba(255,255,255,0.3) + line-through; render done first then todos

// Streak milestones  (services/gamification/StreakMilestoneManager.ts) - verbatim:
const MILESTONES = [
  { days: 3,  name: "First Spark",       description: "The flame is lit" },
  { days: 7,  name: "One Week Strong",   description: "A full week of dedication" },
  { days: 14, name: "Fortnight Forged",  description: "Two weeks of discipline" },
  { days: 21, name: "Pattern Locked",    description: "Your rhythm is set" },
  { days: 30, name: "One Month Deep",    description: "A full cycle complete" },
  { days: 45, name: "Relentless",        description: "45 days strong" },
  { days: 66, name: "Sovereign Complete",description: "Scientific threshold for permanent change" },
];
// For streak = 7:
//   currentMilestone = "One Week Strong" (highest days <= 7)
//   nextMilestone    = { days:14, name:"Fortnight Forged" }
//   fromDays = 7, range = 14-7 = 7, progress = (7-7)/7*100 = 0%  <-- edge: bar empty
//   "days to go" = 14-7 = 7
// To show a FILLED bar in the mock, prefer streak = 10:
//   currentMilestone "One Week Strong", next {14,"Fortnight Forged"}
//   fromDays 7, range 7, progress (10-7)/7*100 = 42.86%, "4 days to go"
// If you use streak=10 also set header pill and hero to 10 and cadence e.g. [1,1,0,1,1,1,1].
```

Recommendation for the hero mock: **streak = 10** so the milestone bar shows a partial fill (~43%) rather than empty. Keep header pill, hero number, and cadence consistent with whichever streak you pick.

---

## 7. BUILD CHECKLIST (so it doesn't look cheap again)
1. Real Inter weight files, one @font-face per weight - no synthetic bold/medium.
2. Use the CUSTOM fontSize scale (§0.1): xl=18, sm=13, base=15, xs=11, etc. - not default Tailwind.
3. Every `text-white/NN`, `bg-*/NN`, `border-*/NN` → exact rgba.
4. Uppercase micro-labels need `letter-spacing` (0.1em widest, 0.025em wide, 4px on Streak label) - this is a big part of the premium look.
5. Copy the real character PNGs + logo; render at exact 200×200 / 40×40 with `object-fit:contain`.
6. Card depth = radial gradient `radial-gradient(80% 60% at 50% 85%, rgb(28,28,28), rgb(8,8,8))` + `rgba(255,255,255,0.03)` border, on pure-black page - not grey fills.
7. Beacon stack: exact scale/translateY/opacity arrays, 0.5px borders.
8. Streak hero: Inter Bold 96px / line-height 104, spring pop-in.
9. Phosphor Fire + Ionicons as inline SVG with correct weights.
</content>
</invoke>
