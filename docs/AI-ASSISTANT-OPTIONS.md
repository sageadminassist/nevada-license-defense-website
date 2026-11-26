# "Ask a Question" assistant: decision needed

**Site:** Nevada License Defense (nevadalicensedefense.com)
**Date:** November 25, 2026
**Decision needed from:** Craig

## The question

The site now has an "Ask a Question" chat button on every page. Should it be powered by
a paid AI service, or stay as a free FAQ matcher?

## Where it stands today

- The chat is built and works without any AI: it matches the visitor's question to the
  closest of the site's 105 FAQ answers and shows that answer word for word.
- In testing it picked the wrong FAQ for an ordinary question ("what do I do if my
  employer sent in a complaint"), so it is not smart enough as is.
- The AI version is also built, but switched off. It turns on when an API key is placed
  on the server, and off again when the key is removed. It has not been tested live yet.

## Options

| Option | Cost | Answer quality | Notes |
|---|---|---|---|
| **A. Anthropic (Claude), small model** | About $1 per 1,000 questions. $5 of credit with a $5 monthly cap would likely last months. | Good: replies to the person's actual wording | Recommended. Needs a one-line model change before launch. |
| B. Anthropic (Claude), large model | Roughly 40 times option A | Best | How it is set right now. More than this job needs. |
| C. A free AI service (Google Gemini, Groq, Cloudflare) | Free | Weaker | Free tiers often let the provider train on what visitors type. Poor fit for a law firm. Would need a rewrite. |
| D. No AI, improve the matcher | Free, no account | Limited: only ever shows a pre-written FAQ answer | Safest. No third party sees the questions. |

Running our own AI model is not practical: the site's hosting cannot do it.

## What the AI version does and does not do

- Answers only from the firm's own FAQ text, in two to five plain sentences.
- Told to give general information, never legal advice, and never to predict an outcome.
- If the FAQ does not cover a question, it says so and points to the free consultation.
- Told not to ask for names or case details, since the chat is not a privileged channel.
- Limits built in: 15 questions per visitor per hour, 400 per day for the whole site.

## Things for Craig to weigh

- **Third party:** with options A to C, visitors' typed questions are sent to an outside
  AI company to generate the answer.
- **Accuracy:** an AI can still word something badly. The chat header says "General
  information, not legal advice". Craig may want to read a sample of answers before launch.
- **Record keeping:** questions typed into the chat are saved in the site's private admin
  area (kept 13 months by default), so the firm can see what people ask.
- **Bar rules:** whether an AI chat on a law firm site needs any extra disclaimer under
  Nevada's advertising rules is Craig's call.

## If the answer is yes (option A or B)

1. Create an account at console.anthropic.com, add a payment method, set a monthly limit.
2. Create an API key there.
3. Put it in a file named `anthropic-key.txt` in the `nld-private` folder on Hostinger.

Full steps are in `docs/ADMIN-SETUP.md`.
