<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Anto Bredly | Portfolio

A minimalist portfolio exploring AI, ML, and complex systems. Built with React, TypeScript, Vite, and Tailwind CSS.

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Build & Deploy

```bash
npm run build
```

Output is in the `dist/` folder. Deploy to Vercel, Netlify, GitHub Pages, or any static host.

---

## Updating Your Portfolio

**All content lives in one file: `config.ts`**

### Add a new project

1. Open `config.ts`
2. Under `projects`, add a new object:

```ts
{
  id: '4',                    // Unique ID (increment from last)
  title: 'My New Project',
  description: 'Short description of what it does.',
  tags: ['React', 'TypeScript'],
  link: 'https://github.com/you/repo',   // Or '#' for "Coming soon"
  image: 'https://example.com/thumbnail.jpg'
}
```

### Update your bio

1. Open `config.ts`
2. Edit `bio.paragraphs` — add, remove, or reorder text
3. Use `"— — —"` as a paragraph for a visual divider
4. Add words to `bio.keywords` to highlight them in the text
5. Update `bio.monogram` if you want different initials

### Update timeline, contact, or skills

Edit the corresponding sections in `config.ts` — each has a short comment explaining what it does.

### After editing

```bash
npm run build
```

Then redeploy your `dist/` folder (or push to your repo if you use continuous deployment).
