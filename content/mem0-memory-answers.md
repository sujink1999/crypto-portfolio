Describe the agent(s) you need memory for.
Vanta's health agent: chat agent in the app that guides a person's training and health over months. The system already tracks supplements, workouts, and sleep as structured data, so memory covers everything outside that: preferences, injuries, symptoms.

Who is the user of these agents?
Vanta's end users, consumers using it across many sessions over months.

Where does the info you want remembered currently live?
Postgres, in the hand-built memory system: fact rows with supersession/expiry, weekly rollups, and a per-chat snapshot.

Give an example of something the agent should remember.
"Prefers outdoor running" or "shoulder injury, can't train for the next week."

Where does the memory-worthy info originate?
Chat sessions. The extractor runs after the reply and writes the fact to memory silently, nothing in the live chat changes.

When should the agent recall it, and what does it do differently?
Snapshot is assembled once at chat start and stays fixed for that chat (so the prompt prefix stays cache-stable). Mid-chat updates just live in the chat itself; the new fact shows up in the next chat's snapshot. With it, the agent plans around the injury and suggests outdoor runs instead of re-asking.
