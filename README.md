Chrome extension to auto-parse profiles in OkCupid and Bumble, identifying those
that are trite, terse or both. Profile that fail to meet requirements are
automatically passed (_i.e._, left-swiped), although profiles that meet certain
geographic criteria are preferred despite profile text content.

This is a prototype, and thus a complete hack. (Moreover, about 3 weeks of
work on the doubletake component was lost when a git repository corrupted
before being pushed to a remote--necessitating hit or miss hatchet job to
re-create lost functionality from memory.

The plan is now to rewrite the entire extension in ElixirScript, leveraging
functional programming idioms to manage control flow and injected state.

Requirements:
 * elixir -- https://elixir-lang.org/install.html
 * webpack -- had to install this globally (ELIFECYCLE / permission denied)
